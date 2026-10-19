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
    public let thumbnailUrl: String
    public let tag: String
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
                title: "AI Cinema Masterpiece",
                prompt: prompt,
                model: model,
                mediaUrl: "/videos/cyberpunk-tokyo.mp4",
                thumbnailUrl: "/videos/thumbnails/cyberpunk-tokyo.jpg",
                tag: "Live AI Render",
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
                title: "Cyberpunk Neo-Tokyo Rain",
                prompt: "Cinematic hyper-detailed neo-Tokyo cyberpunk alley at night, torrential neon rain, holographic dragons, 35mm lens",
                model: "11Cinema-Ultra-v2",
                mediaUrl: "/videos/cyberpunk-tokyo.mp4",
                thumbnailUrl: "/videos/thumbnails/cyberpunk-tokyo.jpg",
                tag: "Trending AI Cinema",
                views: "48.2K",
                likes: "8.4K"
            ),
            GenerationItem(
                id: "v-2",
                type: "video",
                title: "Quantum Abyss Leviathan",
                prompt: "Bioluminescent colossal whale navigating through liquid crystalline starlight in deep space, glowing tentacles, slow motion ethereal lighting",
                model: "11Luma-Diffusion-X",
                mediaUrl: "/videos/quantum-abyss.mp4",
                thumbnailUrl: "/videos/thumbnails/quantum-abyss.jpg",
                tag: "Editor Choice",
                views: "62.9K",
                likes: "14.1K"
            ),
            GenerationItem(
                id: "v-3",
                type: "video",
                title: "Solarpunk Titan Forest",
                prompt: "Towering biomechanical glass redwood trees absorbing sunlight, solar particles shimmering in mist, drone tracking shot at golden hour",
                model: "11Sora-Gen-Prime",
                mediaUrl: "/videos/solarpunk-forest.mp4",
                thumbnailUrl: "/videos/thumbnails/solarpunk-forest.jpg",
                tag: "Photorealistic",
                views: "33.4K",
                likes: "6.7K"
            ),
            GenerationItem(
                id: "v-4",
                type: "video",
                title: "Desert Mirage Hypercar",
                prompt: "Liquid mercury hypercar cruising across obsidian desert at twilight, heat distortion, trailing cyan lasers, 24fps cinema pan",
                model: "11Kling-Motion-Studio",
                mediaUrl: "/videos/desert-hypercar.mp4",
                thumbnailUrl: "/videos/thumbnails/desert-hypercar.jpg",
                tag: "Motion VFX",
                views: "51.8K",
                likes: "9.3K"
            ),
            GenerationItem(
                id: "v-5",
                type: "video",
                title: "Obsidian Oracle Awakening",
                prompt: "Hyper-realistic cybernetic oracle sculpted from obsidian and radiant gold filigree, glowing neon eyes awakening, dynamic cinematic dolly push",
                model: "11Runway-Gen3-Alpha",
                mediaUrl: "/videos/obsidian-oracle.mp4",
                thumbnailUrl: "/videos/thumbnails/obsidian-oracle.jpg",
                tag: "AI Character Motion",
                views: "71.5K",
                likes: "18.9K"
            ),
            GenerationItem(
                id: "v-6",
                type: "video",
                title: "Quantum Neural Synapse",
                prompt: "Macro camera fly-through inside quantum neural processor, pulsing violet and emerald synapses, data streams flowing at speed of light",
                model: "11FLUX-Motion-Pro",
                mediaUrl: "/videos/neon-synapse.mp4",
                thumbnailUrl: "/videos/thumbnails/neon-synapse.jpg",
                tag: "Quantum VFX",
                views: "39.0K",
                likes: "7.8K"
            ),
            GenerationItem(
                id: "v-7",
                type: "video",
                title: "Cosmic Horizon Singularity",
                prompt: "Interstellar accretion disk spinning around supermassive black hole, gravitational lensing bending starlight, epic cinematic slow motion 60fps",
                model: "11Hailuo-MiniMax",
                mediaUrl: "/videos/cosmic-blackhole.mp4",
                thumbnailUrl: "/videos/thumbnails/cosmic-blackhole.jpg",
                tag: "Sci-Fi Epic",
                views: "84.1K",
                likes: "22.3K"
            ),
            GenerationItem(
                id: "v-8",
                type: "video",
                title: "Cyber Samurai Neon Duel",
                prompt: "Cyber samurai with energized plasma katana in torrential rain, neon reflections on wet asphalt, dramatic low-angle camera roll",
                model: "11Pika-Cinematic-v2",
                mediaUrl: "/videos/cyber-samurai.mp4",
                thumbnailUrl: "/videos/thumbnails/cyber-samurai.jpg",
                tag: "Action Motion",
                views: "56.7K",
                likes: "12.8K"
            )
        ]
    }
}
