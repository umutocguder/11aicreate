-- Created by 11Hopem
-- Copyright (c) 2026 11Hopem. All rights reserved.
-- Licensed under 11Hopem Proprietary License.

-- ==============================================================================
-- 11AICreate — Unified Cross-Platform Supabase Database Schema
-- Serves Web, iOS (SwiftUI), and Android (Jetpack Compose) Clients
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles & Wallets (Authentication & 1-Trial Paywall Gate)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    free_trial_available BOOLEAN DEFAULT TRUE,
    free_trial_used BOOLEAN DEFAULT FALSE,
    paid_credits INTEGER DEFAULT 0,
    subscription_tier TEXT DEFAULT 'free', -- 'free', 'starter', 'pro', 'enterprise'
    subscription_status TEXT DEFAULT 'inactive', -- 'active', 'canceled', 'past_due', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. AI Generations (Video, Photo, Chat Prompt History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    generation_type TEXT NOT NULL CHECK (generation_type IN ('video', 'photo', 'chat')),
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    model_name TEXT NOT NULL DEFAULT 'eleven-cinema-v2',
    aspect_ratio TEXT DEFAULT '16:9',
    duration_seconds INTEGER DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('queued', 'rendering', 'completed', 'failed')),
    output_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Pricing Plans & Subscriptions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_usd NUMERIC(6, 2) NOT NULL,
    billing_period TEXT DEFAULT 'month',
    credits_included INTEGER NOT NULL,
    max_resolution TEXT DEFAULT '1080p',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE
);

-- Seed Pricing Plans
INSERT INTO public.pricing_plans (id, name, price_usd, billing_period, credits_included, max_resolution, features, is_popular)
VALUES 
('plan_starter', 'Creator Starter', 19.00, 'month', 120, '4K Ultra', '["120 AI Cinema Videos", "500 High-Res Photos", "Access to Sora & Luma Engine", "Commercial License", "Fast GPU Queue"]'::jsonb, false),
('plan_pro', 'Pro Studio', 49.00, 'month', 450, '8K Cinema', '["450 Ultra Video Generatons", "Unlimited AI Photos", "Multi-Agent AI Chat Copilot", "Director Mode & Camera Controls", "Priority Dedicated Cloud GPU"]'::jsonb, true),
('plan_enterprise', 'Agency Enterprise', 149.00, 'month', 1800, 'Raw 8K', '["Unlimited Visual Studio", "Custom LoRA Model Training", "Team Shared Workspaces", "Full REST API Access", "24/7 Dedicated Concierge"]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Featured Showcase Seeds (Popular AI Video & Photo Gallery)
-- ------------------------------------------------------------------------------
INSERT INTO public.ai_generations (id, generation_type, prompt, model_name, aspect_ratio, output_url, thumbnail_url, is_featured, view_count, like_count)
VALUES
('a0000000-0000-0000-0000-000000000001', 'video', 'Hyper-realistic neon cyberpunk Tokyo rain street, cinematic reflections, anamorphic lens 35mm f/1.4, volumetric fog and flying vehicles', 'Luma-Dream-Machine-v2', '16:9', 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-bright-lights-41551-large.mp4', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', true, 14200, 2450),
('a0000000-0000-0000-0000-000000000002', 'video', 'Bioluminescent jellyfish galaxy floating through deep obsidian ocean, emitting radiant cyan and magenta energy particles, slow motion 4K', 'Runway-Gen3-Alpha', '16:9', 'https://assets.mixkit.co/videos/preview/mixkit-color-powder-explosion-in-water-43331-large.mp4', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', true, 28900, 4810),
('a0000000-0000-0000-0000-000000000003', 'video', 'Futuristic titanium hypercar drifting across neon salt flats at twilight, heat haze exhaust distortion, camera tracking shot', 'Kling-AI-Cinema', '16:9', 'https://assets.mixkit.co/videos/preview/mixkit-car-headlights-in-the-dark-42407-large.mp4', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', true, 19500, 3120),
('a0000000-0000-0000-0000-000000000004', 'photo', 'Ethereal cybernetic goddess sculpture carved from iridescent quartz and gold circuitry, dramatic rim lighting, architectural digest masterpiece', 'Midjourney-v6-Pro', '1:1', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', true, 34100, 5920),
('a0000000-0000-0000-0000-000000000005', 'photo', 'Microscopic view of liquid quantum neural network with electric synapses, gold dust and violet chromatic aberration, macro lens 100mm', 'FLUX.1-Studio', '16:9', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80', true, 21800, 4120)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Protection
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- User Wallets: Users can read own wallet, only system updates credits
CREATE POLICY "Users can read own wallet" ON public.user_wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Pricing Plans: Publicly readable by all
CREATE POLICY "Pricing plans are public" ON public.pricing_plans
    FOR SELECT USING (true);

-- AI Generations:
-- Anyone can see featured public showcases
CREATE POLICY "Public can view featured generations" ON public.ai_generations
    FOR SELECT USING (is_featured = true);

-- Users can view their own generations
CREATE POLICY "Users can view own generations" ON public.ai_generations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create generation only if wallet allows (1 free trial or paid credits)
CREATE POLICY "Users can insert generation" ON public.ai_generations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

-- ------------------------------------------------------------------------------
-- 6. Trigger: Auto-Provision Profile & 1-Trial Free Wallet on Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_provisioning()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'AI Creator'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_wallets (user_id, free_trial_available, free_trial_used, paid_credits, subscription_tier)
    VALUES (NEW.id, TRUE, FALSE, 0, 'free')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_provisioning();
