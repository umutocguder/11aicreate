/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

package com.elevenaicreate.app

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val CyberCyan = Color(0xFF00F0FF)
val ElectricPurple = Color(0xFFA855F7)
val NeonPink = Color(0xFFEC4899)
val DarkSurface = Color(0xFF0D0F18)
val DarkBackground = Color(0xFF050508)
val BorderColor = Color(0xFF1F2438)

private val DarkColorScheme = darkColorScheme(
    primary = CyberCyan,
    secondary = ElectricPurple,
    tertiary = NeonPink,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White
)

@Composable
fun ElevenAICreateTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
