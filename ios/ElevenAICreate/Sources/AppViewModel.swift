/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import Foundation
import Combine

public struct GenerationItem: Identifiable, Codable {
    public let id: String
    public let type: String // "video", "photo", "chat"
    public let title: String
    public let prompt: String
    public let model: String
    public let mediaUrl: String
    public let views: String
    public let likes: String
}

public class AppViewModel: ObservableObject {
    @Published public var isAuthenticated: Bool = false
    @Published public var userEmail: String = ""
    @Published public var freeTrialAvailable: Bool = true
    @Published public var freeTrialUsed: Bool = false
    @Published public var paidCredits: Int = 0
    @Published public var isGenerating: Bool = false
    @Published public var showPaywallModal: Bool = false
    @Published public var recentGenerations: [GenerationItem] = []
    
    public init() {
        loadMockShowcase()
    }
    
    public func canGenerate() -> Bool {
        if freeTrialAvailable && !freeTrialUsed {
            return true
        }
        return paidCredits > 0
    }
    
    public func generateContent(prompt: String, type: String, model: String) {
        guard !prompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        
        guard canGenerate() else {
            showPaywallModal = true
            return
        }
        
        isGenerating = true
        
        // Consume credit
        if freeTrialAvailable && !freeTrialUsed {
            freeTrialUsed = true
            freeTrialAvailable = false
        } else if paidCredits > 0 {
            paidCredits -= 1
        }
        
        // Simulate remote Supabase / GPU generation
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            guard let self = self else { return }
            self.isGenerating = false
            let newItem = GenerationItem(
                id: UUID().uuidString,
                type: type,
                title: "AI Master Creation",
                prompt: prompt,
                model: model,
                mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-bright-lights-41551-large.mp4",
                views: "1",
                likes: "1"
            )
            self.recentGenerations.insert(newItem, at: 0)
        }
    }
    
    public func purchasePlan(planId: String) {
        let addedCredits: Int
        switch planId {
        case "plan_starter": addedCredits = 120
        case "plan_pro": addedCredits = 450
        case "plan_enterprise": addedCredits = 1800
        default: addedCredits = 100
        }
        paidCredits += addedCredits
        showPaywallModal = false
    }
    
    public func login(email: String) {
        self.userEmail = email
        self.isAuthenticated = true
    }
    
    public func logout() {
        self.userEmail = ""
        self.isAuthenticated = false
    }
    
    private func loadMockShowcase() {
        recentGenerations = [
            GenerationItem(
                id: "v-1",
                type: "video",
                title: "Neo-Tokyo Cyberpunk Rain",
                prompt: "Hyper-realistic cyberpunk street in Tokyo, neon rain, holographic dragons, 35mm lens",
                model: "11Cinema-Ultra-v2",
                mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-bright-lights-41551-large.mp4",
                views: "48.2K",
                likes: "8.4K"
            ),
            GenerationItem(
                id: "v-2",
                type: "video",
                title: "Quantum Abyss Leviathan",
                prompt: "Bioluminescent whale swimming through space starlight, cyan magenta particles",
                model: "11Luma-Diffusion-X",
                mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-color-powder-explosion-in-water-43331-large.mp4",
                views: "62.9K",
                likes: "14.1K"
            )
        ]
    }
}
