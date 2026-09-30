import 'package:flutter/material.dart';
import '../models/types.dart';
import '../services/ai_service.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';
import '../utils/water_calc.dart';

class FarmerAssistantScreen extends StatefulWidget {
  final String userId;
  final FarmDetails? farm;
  final List<WaterUsageRecord> records;
  final WaterAnalytics analytics;
  final Function(String? guideId) onNavigateToKnowledge;
  final VoidCallback onNavigateToRecords;

  const FarmerAssistantScreen({
    super.key,
    required this.userId,
    required this.farm,
    required this.records,
    required this.analytics,
    required this.onNavigateToKnowledge,
    required this.onNavigateToRecords,
  });

  @override
  State<FarmerAssistantScreen> createState() => _FarmerAssistantScreenState();
}

class _FarmerAssistantScreenState extends State<FarmerAssistantScreen> {
  final TextEditingController _textCtrl = TextEditingController();
  final ScrollController _scrollCtrl = TextEditingController() as ScrollController? ?? ScrollController();
  late String _sessionId;
  bool _loading = false;
  String? _errorMessage;
  String? _lastPrompt;
  List<ChatMessage> _messages = [];

  final List<Map<String, String>> _quickQuestions = [
    {'text': 'How can I save water?', 'icon': '💧'},
    {'text': 'Tell me about my crop', 'icon': '🌾'},
    {'text': 'How does drip irrigation work?', 'icon': '🚿'},
    {'text': 'How does soil affect irrigation?', 'icon': '🌱'},
    {'text': 'How can I use rainwater?', 'icon': '🌧️'},
    {'text': 'Explain my water usage', 'icon': '📊'},
  ];

  @override
  void initState() {
    super.initState();
    _sessionId = 'session_${widget.userId}';
    _subscribeMessages();
  }

  void _subscribeMessages() {
    FirebaseService().streamChatMessages(widget.userId, _sessionId).listen((msgs) {
      if (mounted) {
        setState(() {
          _messages = msgs;
        });
        _scrollToBottom();
      }
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage([String? customPrompt]) async {
    final text = customPrompt ?? _textCtrl.text.trim();
    if (text.isEmpty || _loading) return;

    if (customPrompt == null) _textCtrl.clear();
    setState(() {
      _loading = true;
      _errorMessage = null;
      _lastPrompt = text;
    });

    final userMsg = ChatMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}_user',
      role: 'user',
      content: text,
      createdAt: DateTime.now().toIso8601String(),
    );

    // Optimistically save and record to Firebase
    await FirebaseService().saveChatMessage(widget.userId, _sessionId, userMsg);
    _scrollToBottom();

    try {
      await AiService.sendMessage(
        message: text,
        history: _messages,
        userId: widget.userId,
        sessionId: _sessionId,
        farm: widget.farm,
        records: widget.records,
        analytics: widget.analytics,
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'AgriFlow Assistant could not connect: ${e.toString()}';
        });
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
        _scrollToBottom();
      }
    }
  }

  @override
  void dispose() {
    _textCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 900),
        child: Column(
          children: [
            // Chat Header Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: AppColors.gray200)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      gradient: AppColors.botGradient,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.smart_toy, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'AgriFlow Farmer Assistant',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.gray900),
                        ),
                        Text(
                          'Grounded in your real farm data & FAO agronomy principles',
                          style: TextStyle(fontSize: 11, color: AppColors.gray600),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_sweep_outlined, size: 20, color: AppColors.gray500),
                    tooltip: 'Clear Chat History',
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: const Text('Clear Chat History?'),
                          content: const Text('Are you sure you want to clear conversation messages?'),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(context, true),
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                              child: const Text('Clear'),
                            ),
                          ],
                        ),
                      );
                      if (confirm == true) {
                        await FirebaseService().clearChatSession(widget.userId, _sessionId);
                        setState(() => _messages = []);
                      }
                    },
                  ),
                ],
              ),
            ),

            // Messages View
            Expanded(
              child: _messages.isEmpty
                  ? _buildEmptyWelcome()
                  : ListView.builder(
                      controller: _scrollCtrl,
                      padding: const EdgeInsets.all(16),
                      itemCount: _messages.length,
                      itemBuilder: (context, idx) {
                        final msg = _messages[idx];
                        return _buildMessageBubble(msg);
                      },
                    ),
            ),

            // Thinking State
            if (_loading)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.gray200),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.emerald700),
                      ),
                      SizedBox(width: 10),
                      Text(
                        'AgriFlow is analyzing farm data and thinking...',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.emerald900),
                      ),
                    ],
                  ),
                ),
              ),

            // Error Banner
            if (_errorMessage != null)
              Container(
                margin: const EdgeInsets.all(12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFCA5A5)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red, size: 20),
                    const SizedBox(width: 10),
                    Expanded(child: Text(_errorMessage!, style: const TextStyle(fontSize: 12, color: Color(0xFF991B1B)))),
                    if (_lastPrompt != null)
                      TextButton(
                        onPressed: () => _sendMessage(_lastPrompt),
                        child: const Text('Retry'),
                      ),
                  ],
                ),
              ),

            // Quick Questions (if few messages)
            if (_messages.length <= 2)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _quickQuestions.map((q) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ActionChip(
                          avatar: Text(q['icon']!),
                          label: Text(q['text']!),
                          onPressed: () => _sendMessage(q['text']!),
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: const BorderSide(color: AppColors.gray200),
                          ),
                          labelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.gray800),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

            // Input Bar
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.gray200)),
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _textCtrl,
                        enabled: !_loading,
                        onSubmitted: (_) => _sendMessage(),
                        decoration: InputDecoration(
                          hintText: 'Ask about water savings, drip maintenance, ETc, or your water logs...',
                          hintStyle: const TextStyle(fontSize: 13, color: AppColors.gray400),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          filled: true,
                          fillColor: AppColors.gray50,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: const BorderSide(color: AppColors.gray200),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: const BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.send, color: Colors.white, size: 18),
                        onPressed: _loading ? null : () => _sendMessage(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyWelcome() {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: AppColors.botGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy, size: 36, color: Colors.white),
            ),
            const SizedBox(height: 16),
            const Text(
              'How can I help your farm today?',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.gray900),
            ),
            const SizedBox(height: 8),
            const Text(
              'Ask agricultural water questions, query your actual water consumption logs, or explore irrigation optimization strategies.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: AppColors.gray600),
            ),
            const SizedBox(height: 20),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: _quickQuestions.map((q) {
                return ElevatedButton.icon(
                  onPressed: () => _sendMessage(q['text']!),
                  icon: Text(q['icon']!, style: const TextStyle(fontSize: 16)),
                  label: Text(q['text']!),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.gray800,
                    elevation: 0,
                    side: const BorderSide(color: AppColors.gray200),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg) {
    final isUser = msg.role == 'user';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: AppColors.botGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.smart_toy, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Column(
              crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isUser ? AppColors.emerald700 : Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(20),
                      topRight: const Radius.circular(20),
                      bottomLeft: Radius.circular(isUser ? 20 : 4),
                      bottomRight: Radius.circular(isUser ? 4 : 20),
                    ),
                    border: isUser ? null : Border.all(color: AppColors.gray200),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: SelectableText(
                    msg.content,
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.45,
                      color: isUser ? Colors.white : AppColors.gray900,
                    ),
                  ),
                ),
                if (!isUser && msg.relatedGuideTitle != null) ...[
                  const SizedBox(height: 6),
                  InkWell(
                    onTap: () => widget.onNavigateToKnowledge(msg.relatedGuideId),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.amber50,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.amber500.withValues(alpha: 0.4)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.menu_book, size: 14, color: AppColors.amber700),
                          const SizedBox(width: 6),
                          Text(
                            'Related Guide: ${msg.relatedGuideTitle}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.amber700),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.arrow_forward, size: 12, color: AppColors.amber700),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.person, color: Colors.white, size: 16),
            ),
          ],
        ],
      ),
    );
  }
}
