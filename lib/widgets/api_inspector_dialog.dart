import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class ApiInspectorDialog extends StatelessWidget {
  const ApiInspectorDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final apiService = ApiService();

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 680, maxHeight: 600),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.teal50,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.network_check, color: AppColors.teal700, size: 22),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'API & Network Inspector',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppColors.gray900,
                          ),
                        ),
                        Text(
                          'Live telemetry for Open-Meteo and AgriFlow Gemini backend',
                          style: TextStyle(fontSize: 12, color: AppColors.gray600),
                        ),
                      ],
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () => apiService.clearLogs(),
                    icon: const Icon(Icons.delete_outline, size: 16),
                    label: const Text('Clear'),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20, color: AppColors.gray400),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const Divider(height: 24),
              Expanded(
                child: StreamBuilder<List<ApiLogEntry>>(
                  stream: apiService.logStream,
                  initialData: apiService.logs,
                  builder: (context, snapshot) {
                    final logs = snapshot.data ?? [];
                    if (logs.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.wifi, size: 48, color: Colors.grey.shade300),
                            const SizedBox(height: 12),
                            const Text(
                              'No API calls recorded yet.',
                              style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.gray500),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'API calls to Open-Meteo & Gemini will appear here in real-time.',
                              style: TextStyle(fontSize: 12, color: AppColors.gray400),
                            ),
                          ],
                        ),
                      );
                    }

                    return ListView.separated(
                      itemCount: logs.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, idx) {
                        final entry = logs[idx];
                        final isSuccess = entry.success;

                        return Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isSuccess ? AppColors.gray50 : const Color(0xFFFEF2F2),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSuccess ? AppColors.gray200 : const Color(0xFFFCA5A5),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: entry.method == 'GET'
                                          ? AppColors.sky50
                                          : AppColors.emerald50,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: entry.method == 'GET'
                                            ? AppColors.sky500
                                            : AppColors.emerald500,
                                        width: 0.5,
                                      ),
                                    ),
                                    child: Text(
                                      entry.method,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                        color: entry.method == 'GET'
                                            ? AppColors.sky700
                                            : AppColors.emerald700,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isSuccess ? AppColors.emerald100 : const Color(0xFFFEE2E2),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '${entry.status} ${entry.statusText}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: isSuccess ? AppColors.emerald800 : const Color(0xFF991B1B),
                                      ),
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    '${entry.latencyMs} ms',
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.gray500),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              SelectableText(
                                entry.url,
                                style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: AppColors.gray800),
                              ),
                              if (entry.errorMessage != null) ...[
                                const SizedBox(height: 4),
                                Text(
                                  'Error: ${entry.errorMessage}',
                                  style: const TextStyle(fontSize: 11, color: Colors.red, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ],
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
