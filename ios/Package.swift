// swift-tools-version: 5.9
// Created by 11Hopem
// Copyright (c) 2026 11Hopem. All rights reserved.
// Licensed under 11Hopem Proprietary License.

import PackageDescription

let package = Package(
    name: "ElevenAICreate",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "ElevenAICreate",
            targets: ["ElevenAICreate"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "ElevenAICreate",
            dependencies: [],
            path: "ElevenAICreate/Sources"
        )
    ]
)
