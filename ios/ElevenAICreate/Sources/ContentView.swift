/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import SwiftUI

public struct ContentView: View {
    @EnvironmentObject var vm: AppViewModel
    @State private var selectedTab = 0
    @State private var promptText: String = ""
    @State private var selectedMode: String = "video"
    
    public init() {}
    
    public var body: some View {
        TabView(selection: $selectedTab) {
            // Studio Tab
            NavigationStack {
                ZStack {
                    Color(red: 0.02, green: 0.02, blue: 0.03).ignoresSafeArea()
                    
                    ScrollView {
                        VStack(spacing: 20) {
                            // Header Status
                            HStack {
                                Image(systemName: "sparkles")
                                    .foregroundColor(.cyan)
                                Text("11AICreate Studio")
                                    .font(.title2.bold())
                                Spacer()
                                if vm.freeTrialAvailable && !vm.freeTrialUsed {
                                    Text("1 Free Trial")
                                        .font(.caption.bold())
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 4)
                                        .background(Color.cyan.opacity(0.15))
                                        .foregroundColor(.cyan)
                                        .cornerRadius(12)
                                } else {
                                    Text("\(vm.paidCredits) Credits")
                                        .font(.caption.bold())
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 4)
                                        .background(Color.purple.opacity(0.15))
                                        .foregroundColor(.purple)
                                        .cornerRadius(12)
                                }
                            }
                            .padding(.horizontal)
                            
                            // Mode Switcher
                            Picker("Mode", selection: $selectedMode) {
                                Text("🎬 Video").tag("video")
                                Text("📸 Photo").tag("photo")
                                Text("💬 Chat").tag("chat")
                            }
                            .pickerStyle(.segmented)
                            .padding(.horizontal)
                            
                            // Prompt Box
                            VStack(alignment: .leading, spacing: 10) {
                                Text("PROMPT DIRECTIVE")
                                    .font(.caption.bold())
                                    .foregroundColor(.gray)
                                
                                TextEditor(text: $promptText)
                                    .frame(minHeight: 100)
                                    .scrollContentBackground(.hidden)
                                    .background(Color(red: 0.06, green: 0.07, blue: 0.10))
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                                    )
                            }
                            .padding(.horizontal)
                            
                            // Action Button
                            Button(action: {
                                vm.generateContent(prompt: promptText, type: selectedMode, model: "11Cinema-Ultra-v2")
                            }) {
                                HStack {
                                    if vm.isGenerating {
                                        ProgressView().tint(.white)
                                        Text("Synthesizing...")
                                    } else {
                                        Image(systemName: vm.canGenerate() ? "wand.and.stars" : "lock.fill")
                                        Text(vm.canGenerate() ? "Generate Cinema Visual" : "Upgrade to Pro (Trial Used)")
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(
                                    LinearGradient(colors: [.cyan, .purple, .pink], startPoint: .leading, endPoint: .trailing)
                                )
                                .foregroundColor(.white)
                                .font(.headline)
                                .cornerRadius(14)
                                .shadow(color: .cyan.opacity(0.3), radius: 8, x: 0, y: 4)
                            }
                            .padding(.horizontal)
                            .disabled(vm.isGenerating)
                            
                            // Popular AI Video Showcase Feed
                            VStack(alignment: .leading, spacing: 16) {
                                HStack {
                                    Image(systemName: "film.stack")
                                        .foregroundColor(.cyan)
                                    Text("POPULAR AI VIDEO SHOWCASE")
                                        .font(.caption.bold())
                                        .foregroundColor(.gray)
                                }
                                .padding(.horizontal)
                                
                                ForEach(vm.recentGenerations) { item in
                                    VStack(alignment: .leading, spacing: 10) {
                                        // Video Preview Banner
                                        ZStack(alignment: .topLeading) {
                                            RoundedRectangle(cornerRadius: 12)
                                                .fill(
                                                    LinearGradient(
                                                        colors: [Color(red: 0.10, green: 0.12, blue: 0.18), Color(red: 0.05, green: 0.06, blue: 0.09)],
                                                        startPoint: .topLeading,
                                                        endPoint: .bottomTrailing
                                                    )
                                                )
                                                .frame(height: 180)
                                                .overlay(
                                                    VStack(spacing: 8) {
                                                        Image(systemName: "play.circle.fill")
                                                            .font(.system(size: 44))
                                                            .foregroundStyle(
                                                                LinearGradient(colors: [.cyan, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
                                                            )
                                                            .shadow(color: .cyan.opacity(0.4), radius: 10)
                                                        Text("Streaming 4K AI Cinema Preview")
                                                            .font(.caption2.bold())
                                                            .foregroundColor(.gray)
                                                    }
                                                )
                                            
                                            // Live Video Badge
                                            HStack(spacing: 6) {
                                                Circle()
                                                    .fill(Color.cyan)
                                                    .frame(width: 6, height: 6)
                                                Text("🎬 LIVE AI VIDEO")
                                                    .font(.system(size: 10, weight: .heavy))
                                                    .foregroundColor(.cyan)
                                            }
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color.black.opacity(0.75))
                                            .cornerRadius(8)
                                            .padding(10)
                                        }
                                        .cornerRadius(12)
                                        
                                        // Details
                                        HStack {
                                            Text(item.tag)
                                                .font(.caption2.bold())
                                                .foregroundColor(.cyan)
                                            Spacer()
                                            Text(item.model)
                                                .font(.caption2)
                                                .foregroundColor(.purple)
                                        }
                                        
                                        Text(item.title)
                                            .font(.headline)
                                            .foregroundColor(.white)
                                        
                                        Text(item.prompt)
                                            .font(.subheadline)
                                            .foregroundColor(.gray)
                                            .lineLimit(3)
                                        
                                        HStack {
                                            Text("👁️ \(item.views)   ❤️ \(item.likes)")
                                                .font(.caption2)
                                                .foregroundColor(.gray)
                                            
                                            Spacer()
                                            
                                            Button(action: {
                                                promptText = item.prompt
                                                selectedMode = "video"
                                            }) {
                                                Text("Use Prompt")
                                                    .font(.caption.bold())
                                                    .padding(.horizontal, 10)
                                                    .padding(.vertical, 5)
                                                    .background(Color.cyan.opacity(0.2))
                                                    .foregroundColor(.cyan)
                                                    .cornerRadius(8)
                                            }
                                        }
                                    }
                                    .padding()
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(Color(red: 0.07, green: 0.08, blue: 0.12))
                                    .cornerRadius(14)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(Color.white.opacity(0.08), lineWidth: 1)
                                    )
                                    .padding(.horizontal)
                                }
                            }
                        }
                        .padding(.vertical)
                    }
                }
                .navigationBarTitleDisplayMode(.inline)
            }
            .tabItem {
                Label("Studio", systemImage: "sparkles")
            }
            .tag(0)
            
            // Paywall Tab
            PaywallView()
                .tabItem {
                    Label("Pricing", systemImage: "crown.fill")
                }
                .tag(1)
        }
        .sheet(isPresented: $vm.showPaywallModal) {
            PaywallView()
        }
    }
}

public struct PaywallView: View {
    @EnvironmentObject var vm: AppViewModel
    
    public init() {}
    
    public var body: some View {
        ZStack {
            Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea()
            
            VStack(spacing: 24) {
                Image(systemName: "crown.fill")
                    .font(.system(size: 54))
                    .foregroundStyle(LinearGradient(colors: [.yellow, .orange], startPoint: .top, endPoint: .bottom))
                
                Text("Unlock 11AICreate Pro")
                    .font(.title.bold())
                
                Text("Your 1 free trial generation is used. Upgrade to unlock full access to cinema video engines, 8K photo renders, and dedicated GPU rendering.")
                    .font(.subheadline)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.gray)
                    .padding(.horizontal)
                
                VStack(spacing: 14) {
                    PlanCardView(
                        name: "Creator Starter",
                        price: "$19/mo",
                        desc: "120 Video Credits • 500 Photos",
                        action: { vm.purchasePlan(planId: "plan_starter") }
                    )
                    
                    PlanCardView(
                        name: "Pro Studio (Best Value)",
                        price: "$49/mo",
                        desc: "450 Video Credits • Unlimited Photos • Dedicated GPU",
                        isFeatured: true,
                        action: { vm.purchasePlan(planId: "plan_pro") }
                    )
                }
                .padding(.horizontal)
                
                Spacer()
            }
            .padding(.top, 40)
        }
    }
}

struct PlanCardView: View {
    let name: String
    let price: String
    let desc: String
    var isFeatured: Bool = false
    let action: () -> Void
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(name)
                    .font(.headline)
                    .foregroundColor(isFeatured ? .cyan : .white)
                Text(desc)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            Spacer()
            Button(action: action) {
                Text(price)
                    .font(.subheadline.bold())
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(isFeatured ? Color.cyan : Color.gray.opacity(0.3))
                    .foregroundColor(isFeatured ? .black : .white)
                    .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(red: 0.08, green: 0.09, blue: 0.14))
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(isFeatured ? Color.cyan : Color.clear, lineWidth: 1.5)
        )
    }
}
