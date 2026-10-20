// Created by 11Hopem
// Copyright (c) 2026 11Hopem. All rights reserved.
// Licensed under 11Hopem Proprietary License.

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.elevenaicreate.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.elevenaicreate.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}
