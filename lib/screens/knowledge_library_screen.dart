import 'package:flutter/material.dart';
import '../data/agronomy_knowledge.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';

class KnowledgeLibraryScreen extends StatefulWidget {
  final List<FavoriteItem> favorites;
  final String userId;
  final Function(int) onNavigateTab;
  final String? initialArticleId;

  const KnowledgeLibraryScreen({
    super.key,
    required this.favorites,
    required this.userId,
    required this.onNavigateTab,
    this.initialArticleId,
  });

  @override
  State<KnowledgeLibraryScreen> createState() => _KnowledgeLibraryScreenState();
}

class _KnowledgeLibraryScreenState extends State<KnowledgeLibraryScreen> {
  String _selectedProblem = 'All';
  final TextEditingController _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.initialArticleId != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final art = kAgronomyArticles.firstWhere(
          (a) => a.id == widget.initialArticleId,
          orElse: () => kAgronomyArticles.first,
        );
        _openArticleDetail(art);
      });
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _openArticleDetail(KnowledgeArticle article) {
    final isSaved = widget.favorites.any((f) => f.itemId == article.id);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (_, scrollCtrl) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24),
          child: ListView(
            controller: scrollCtrl,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: AppColors.emerald50, borderRadius: BorderRadius.circular(12)),
                    child: Text(article.category, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.emerald800)),
                  ),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const SizedBox(height: 10),
              Text(article.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900)),
              const SizedBox(height: 6),
              Text('⏱️ ${article.readTime} · 💡 ${article.benefitLabel}', style: const TextStyle(fontSize: 12, color: AppColors.gray600)),
              const Divider(height: 28),

              // What is it
              _buildSectionTitle('What Is It?'),
              Text(article.whatIsIt, style: const TextStyle(fontSize: 14, color: AppColors.gray800, height: 1.5)),
              const SizedBox(height: 16),

              // How water reaches roots
              if (article.howWaterReachesRoots != null) ...[
                _buildSectionTitle('How Water Reaches the Root-Zone'),
                Text(article.howWaterReachesRoots!, style: const TextStyle(fontSize: 14, color: AppColors.gray800, height: 1.5)),
                const SizedBox(height: 16),
              ],

              // Benefits
              if (article.benefits != null && article.benefits!.isNotEmpty) ...[
                _buildSectionTitle('Key Agronomic Benefits'),
                ...article.benefits!.map((b) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.check_circle, size: 16, color: AppColors.emerald700),
                          const SizedBox(width: 8),
                          Expanded(child: Text(b, style: const TextStyle(fontSize: 13, color: AppColors.gray800))),
                        ],
                      ),
                    )),
                const SizedBox(height: 16),
              ],

              // Why it matters
              _buildSectionTitle('Why It Matters for Your Farm'),
              Text(article.whyItMatters, style: const TextStyle(fontSize: 14, color: AppColors.gray800, height: 1.5)),
              const SizedBox(height: 16),

              // What can farmer do
              _buildSectionTitle('Practical Steps for the Farmer'),
              ...article.whatCanFarmerDo.map((step) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.gray50,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.gray200),
                      ),
                      child: Text(step, style: const TextStyle(fontSize: 13, color: AppColors.gray900)),
                    ),
                  )),
              const SizedBox(height: 16),

              // Things to check
              _buildSectionTitle('Farm Inspection Checklist'),
              ...article.thingsToCheck.map((chk) => Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.radio_button_unchecked, size: 14, color: AppColors.teal700),
                        const SizedBox(width: 8),
                        Expanded(child: Text(chk, style: const TextStyle(fontSize: 13, color: AppColors.gray800))),
                      ],
                    ),
                  )),
              const SizedBox(height: 16),

              // Caution
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.amber50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.amber500.withValues(alpha: 0.3)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: AppColors.amber700, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        article.importantCaution,
                        style: const TextStyle(fontSize: 12, color: AppColors.amber700, height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Favorite Action
              ElevatedButton.icon(
                onPressed: () async {
                  await FirebaseService().toggleFavoriteItem(
                    widget.userId,
                    FavoriteItem(
                      itemId: article.id,
                      userId: widget.userId,
                      title: article.title,
                      category: article.category,
                      savedAt: DateTime.now().toIso8601String(),
                    ),
                    isSaved,
                  );
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                icon: Icon(isSaved ? Icons.bookmark_remove : Icons.bookmark_add),
                label: Text(isSaved ? 'Remove from Saved Guides' : 'Save to My Farm Guides'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isSaved ? Colors.grey.shade700 : AppColors.emerald700,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.gray900)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchCtrl.text.toLowerCase().trim();

    final filtered = kAgronomyArticles.where((art) {
      if (_selectedProblem == 'Saved') {
        if (!widget.favorites.any((f) => f.itemId == art.id)) return false;
      } else if (_selectedProblem != 'All') {
        if (art.problemCategory != _selectedProblem) return false;
      }

      if (query.isNotEmpty) {
        final matchesTitle = art.title.toLowerCase().contains(query);
        final matchesDesc = art.whatIsIt.toLowerCase().contains(query);
        final matchesKey = art.keywords.any((k) => k.toLowerCase().contains(query));
        return matchesTitle || matchesDesc || matchesKey;
      }
      return true;
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '📚 Problem-Oriented Agronomy Library',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900),
                    ),
                    SizedBox(height: 6),
                    Text(
                      'Actionable guides for drip efficiency, emitter unclogging, soil water capacity, mulching, and deficit irrigation.',
                      style: TextStyle(fontSize: 13, color: AppColors.gray700),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Search Bar
              TextFormField(
                controller: _searchCtrl,
                decoration: InputDecoration(
                  hintText: 'Search guides by keywords (e.g. drip, clog, AWC, ETc, mulch, pond)...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.emerald700),
                  suffixIcon: _searchCtrl.text.isNotEmpty
                      ? IconButton(icon: const Icon(Icons.clear), onPressed: () => setState(() => _searchCtrl.clear()))
                      : null,
                ),
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: 14),

              // Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildChip('All', 'All Guides'),
                    const SizedBox(width: 8),
                    _buildChip('Saved', 'Saved (${widget.favorites.length})'),
                    const SizedBox(width: 8),
                    ...kProblemCategories.map((p) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: _buildChip(p.id, '${p.icon} ${p.title}'),
                        )),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Articles
              if (filtered.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.gray200),
                  ),
                  child: const Center(
                    child: Column(
                      children: [
                        Icon(Icons.search_off, size: 48, color: Colors.grey),
                        SizedBox(height: 12),
                        Text('No guides match this filter.', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                )
              else
                ...filtered.map((art) => _buildArticleCard(art)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChip(String id, String label) {
    final isSel = _selectedProblem == id;
    return FilterChip(
      label: Text(label),
      selected: isSel,
      onSelected: (_) => setState(() => _selectedProblem = id),
      backgroundColor: Colors.white,
      selectedColor: AppColors.emerald100,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
        color: isSel ? AppColors.emerald900 : AppColors.gray700,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: isSel ? AppColors.emerald500 : AppColors.gray200),
      ),
    );
  }

  Widget _buildArticleCard(KnowledgeArticle art) {
    final isSaved = widget.favorites.any((f) => f.itemId == art.id);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.emerald50, borderRadius: BorderRadius.circular(10)),
                child: Text(art.category, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.emerald800)),
              ),
              const SizedBox(width: 8),
              Text('⏱️ ${art.readTime}', style: const TextStyle(fontSize: 11, color: AppColors.gray500)),
              const Spacer(),
              IconButton(
                icon: Icon(isSaved ? Icons.bookmark : Icons.bookmark_border, color: isSaved ? AppColors.emerald700 : AppColors.gray400),
                onPressed: () async {
                  await FirebaseService().toggleFavoriteItem(
                    widget.userId,
                    FavoriteItem(
                      itemId: art.id,
                      userId: widget.userId,
                      title: art.title,
                      category: art.category,
                      savedAt: DateTime.now().toIso8601String(),
                    ),
                    isSaved,
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(art.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.gray900)),
          const SizedBox(height: 6),
          Text(art.whatIsIt, maxLines: 3, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13, color: AppColors.gray600)),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.teal50, borderRadius: BorderRadius.circular(10)),
                child: Text('💡 ${art.benefitLabel}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.teal700)),
              ),
              ElevatedButton(
                onPressed: () => _openArticleDetail(art),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.emerald700,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  textStyle: const TextStyle(fontSize: 12),
                ),
                child: const Text('Read Full Guide'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
