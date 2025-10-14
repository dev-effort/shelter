package com.shelter.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            super.onCreate(savedInstanceState);
            android.util.Log.d("MainActivity", "✅ onCreate completed");
            
            // Handle share intent in a separate thread to avoid blocking
            final Intent intent = getIntent();
            if (intent != null) {
                new Thread(() -> {
                    try {
                        Thread.sleep(500); // Wait 0.5 second for app to fully initialize
                        handleShareIntent(intent);
                    } catch (Exception e) {
                        android.util.Log.e("MainActivity", "Error in share thread", e);
                    }
                }).start();
            }
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Error in onCreate", e);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        try {
            super.onNewIntent(intent);
            android.util.Log.d("MainActivity", "✅ onNewIntent called");
            
            if (intent != null) {
                new Thread(() -> {
                    try {
                        handleShareIntent(intent);
                    } catch (Exception e) {
                        android.util.Log.e("MainActivity", "Error in share thread", e);
                    }
                }).start();
            }
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Error in onNewIntent", e);
        }
    }

    private void handleShareIntent(Intent intent) {
        try {
            if (intent == null) {
                android.util.Log.d("MainActivity", "Intent is null");
                return;
            }

            String action = intent.getAction();
            String type = intent.getType();
            
            android.util.Log.d("MainActivity", "========== SHARE INTENT DEBUG START ==========");
            android.util.Log.d("MainActivity", "Action: " + action);
            android.util.Log.d("MainActivity", "Type: " + type);

            if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
                // 모든 가능한 extra 데이터 로깅
                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
                String sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT);
                String sharedHtml = intent.getStringExtra(Intent.EXTRA_HTML_TEXT);
                
                android.util.Log.d("MainActivity", "📝 EXTRA_TEXT: " + sharedText);
                android.util.Log.d("MainActivity", "📌 EXTRA_SUBJECT: " + sharedTitle);
                android.util.Log.d("MainActivity", "🌐 EXTRA_HTML_TEXT: " + sharedHtml);
                
                // Intent의 모든 extras 출력
                android.os.Bundle extras = intent.getExtras();
                if (extras != null) {
                    android.util.Log.d("MainActivity", "📦 All extras:");
                    for (String key : extras.keySet()) {
                        Object value = extras.get(key);
                        android.util.Log.d("MainActivity", "  - " + key + " = " + value);
                    }
                }
                
                android.util.Log.d("MainActivity", "========== SHARE INTENT DEBUG END ==========");
                
                if (sharedText != null && !sharedText.isEmpty()) {
                    saveSharedData(sharedText, sharedTitle);
                }
            }
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Error in handleShareIntent", e);
        }
    }

    private void saveSharedData(String sharedText, String title) {
        try {
            if (sharedText == null || sharedText.isEmpty()) {
                android.util.Log.w("MainActivity", "Shared text is empty");
                return;
            }

            android.util.Log.d("MainActivity", "🔍 Parsing shared text...");
            android.util.Log.d("MainActivity", "Original text: " + sharedText);

            // 네이버 지도 등의 앱에서는 텍스트에 URL이 포함되어 있음
            // 형식: [앱명]\n제목\n주소\nURL
            String extractedUrl = null;
            String extractedTitle = title; // 기본값

            // 줄 단위로 분리
            String[] lines = sharedText.split("\n");
            android.util.Log.d("MainActivity", "📝 Total lines: " + lines.length);

            // URL 찾기 (http:// 또는 https://로 시작하는 줄)
            for (int i = lines.length - 1; i >= 0; i--) {
                String line = lines[i].trim();
                android.util.Log.d("MainActivity", "Line " + i + ": " + line);
                
                if (line.startsWith("http://") || line.startsWith("https://")) {
                    extractedUrl = line;
                    android.util.Log.d("MainActivity", "✅ URL found at line " + i + ": " + extractedUrl);
                    
                    // 제목 추출 (URL 이전 줄 중에서)
                    // 첫 줄이 [앱명] 형식이면 두 번째 줄을 제목으로
                    if (extractedTitle == null || extractedTitle.isEmpty()) {
                        if (lines.length > 1 && lines[0].startsWith("[") && lines[0].endsWith("]")) {
                            // [네이버 지도] 같은 경우
                            if (lines.length > 1) {
                                extractedTitle = lines[1].trim();
                                android.util.Log.d("MainActivity", "📌 Title extracted from line 1: " + extractedTitle);
                            }
                        } else if (lines.length > 0) {
                            // 첫 줄을 제목으로
                            extractedTitle = lines[0].trim();
                            android.util.Log.d("MainActivity", "📌 Title extracted from line 0: " + extractedTitle);
                        }
                    }
                    break;
                }
            }

            // URL을 찾지 못한 경우, 전체 텍스트가 URL일 수 있음
            if (extractedUrl == null) {
                String trimmed = sharedText.trim();
                if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                    extractedUrl = trimmed;
                    android.util.Log.d("MainActivity", "✅ Entire text is URL: " + extractedUrl);
                } else {
                    android.util.Log.w("MainActivity", "❌ No URL found in shared text");
                    return;
                }
            }

            // SharedPreferences에 저장
            android.content.SharedPreferences prefs = 
                getSharedPreferences("CapacitorStorage", MODE_PRIVATE);
            
            if (prefs == null) {
                android.util.Log.e("MainActivity", "SharedPreferences is null");
                return;
            }
            
            android.content.SharedPreferences.Editor editor = prefs.edit();
            editor.putString("shelter_shared_url", extractedUrl);
            
            if (extractedTitle != null && !extractedTitle.isEmpty()) {
                editor.putString("shelter_shared_title", extractedTitle);
                android.util.Log.d("MainActivity", "💾 Saving title: " + extractedTitle);
            }
            
            editor.putString("shelter_share_pending", "true");
            
            boolean committed = editor.commit();
            
            if (committed) {
                android.util.Log.d("MainActivity", "✅ Share data saved - URL: " + extractedUrl + ", Title: " + extractedTitle);
            } else {
                android.util.Log.e("MainActivity", "❌ Failed to save share data");
            }
            
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Exception in saveSharedData", e);
        }
    }
}
