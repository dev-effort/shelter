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
            
            android.util.Log.d("MainActivity", "Action: " + action + ", Type: " + type);

            if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
                String sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT);
                
                android.util.Log.d("MainActivity", "Shared text: " + sharedText);
                
                if (sharedText != null && !sharedText.isEmpty()) {
                    saveSharedData(sharedText, sharedTitle);
                }
            }
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Error in handleShareIntent", e);
        }
    }

    private void saveSharedData(String url, String title) {
        try {
            if (url == null || url.isEmpty()) {
                android.util.Log.w("MainActivity", "URL is empty");
                return;
            }

            android.content.SharedPreferences prefs = 
                getSharedPreferences("CapacitorStorage", MODE_PRIVATE);
            
            if (prefs == null) {
                android.util.Log.e("MainActivity", "SharedPreferences is null");
                return;
            }
            
            android.content.SharedPreferences.Editor editor = prefs.edit();
            editor.putString("shelter_shared_url", url);
            
            if (title != null && !title.isEmpty()) {
                editor.putString("shelter_shared_title", title);
            }
            
            editor.putString("shelter_share_pending", "true"); // Must be String, not Boolean!
            
            boolean committed = editor.commit(); // Use commit instead of apply for immediate save
            
            if (committed) {
                android.util.Log.d("MainActivity", "✅ Share data saved: " + url);
            } else {
                android.util.Log.e("MainActivity", "❌ Failed to save share data");
            }
            
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Exception in saveSharedData", e);
        }
    }
}
