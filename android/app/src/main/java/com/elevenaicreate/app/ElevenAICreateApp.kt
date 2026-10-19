/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

package com.elevenaicreate.app

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class StudioViewModel {
    var freeTrialAvailable by mutableStateOf(true)
    var freeTrialUsed by mutableStateOf(false)
    var paidCredits by mutableStateOf(0)
    var isGenerating by mutableStateOf(false)
    var showPaywall by mutableStateOf(false)

    fun canGenerate(): Boolean {
        if (freeTrialAvailable && !freeTrialUsed) return true
        return paidCredits > 0
    }

    fun generate(prompt: String) {
        if (!canGenerate()) {
            showPaywall = true
            return
        }

        if (freeTrialAvailable && !freeTrialUsed) {
            freeTrialUsed = true
            freeTrialAvailable = false
        } else if (paidCredits > 0) {
            paidCredits -= 1
        }
    }

    fun purchasePlan(credits: Int) {
        paidCredits += credits
        showPaywall = false
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ElevenAICreateMainScreen(viewModel: StudioViewModel = remember { StudioViewModel() }) {
    var prompt by remember { mutableStateOf("") }
    var selectedTab by remember { mutableStateOf("video") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            "11AICreate",
                            fontWeight = FontWeight.Black,
                            color = CyberCyan
                        )
                    }
                },
                actions = {
                    val statusText = if (viewModel.canGenerate()) {
                        if (viewModel.freeTrialAvailable && !viewModel.freeTrialUsed) "1 Free Trial" else "${viewModel.paidCredits} Credits"
                    } else "Trial Used (Upgrade)"

                    Surface(
                        color = if (viewModel.canGenerate()) CyberCyan.copy(alpha = 0.15f) else NeonPink.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.padding(end = 12.dp)
                    ) {
                        Text(
                            text = statusText,
                            color = if (viewModel.canGenerate()) CyberCyan else NeonPink,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = DarkBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "AI Visual Studio",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Cross-platform neural generation connected to Supabase Cloud",
                    fontSize = 14.sp,
                    color = Color.Gray
                )
            }

            item {
                OutlinedTextField(
                    value = prompt,
                    onValueChange = { prompt = it },
                    placeholder = { Text("Enter prompt: e.g. Cyberpunk samurai in neon rain...") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyberCyan,
                        unfocusedBorderColor = BorderColor,
                        focusedContainerColor = DarkSurface,
                        unfocusedContainerColor = DarkSurface
                    )
                )
            }

            item {
                Button(
                    onClick = { viewModel.generate(prompt) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.horizontalGradient(listOf(CyberCyan, ElectricPurple, NeonPink)),
                                shape = RoundedCornerShape(14.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (viewModel.canGenerate()) "Generate Visual" else "Upgrade to Pro (Trial Used)",
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }

    if (viewModel.showPaywall) {
        AlertDialog(
            onDismissRequest = { viewModel.showPaywall = false },
            title = { Text("Unlock 11AICreate Pro", fontWeight = FontWeight.Bold) },
            text = { Text("You have used your 1 free generation. Choose a plan to continue creating cinema videos and 8K photos.") },
            confirmButton = {
                Button(onClick = { viewModel.purchasePlan(450) }) {
                    Text("Subscribe Pro ($49/mo)")
                }
            },
            dismissButton = {
                TextButton(onClick = { viewModel.showPaywall = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
