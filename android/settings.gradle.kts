// Created by 11Hopem
// Copyright (c) 2026 11Hopem. All rights reserved.
// Licensed under 11Hopem Proprietary License.

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "ElevenAICreate"
include(":app")
