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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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

data class ShowcaseVideoItem(
    val title: String,
    val prompt: String,
    val model: String,
    val tag: String,
    val views: String,
    val likes: String
)

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

            item {
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "POPULAR AI VIDEO SHOWCASE",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray
                    )
                }
            }

            items(popularVideos) { video ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = DarkSurface),
                    border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(BorderColor, Color.Transparent)))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        // Video Player Preview Box
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp)
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color(0xFF1E2235), Color(0xFF0D0E15))
                                    ),
                                    shape = RoundedCornerShape(12.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Surface(
                                    color = CyberCyan.copy(alpha = 0.2f),
                                    shape = CircleShape,
                                    modifier = Modifier.size(48.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text("▶", fontSize = 20.sp, color = CyberCyan)
                                    }
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "Streaming 4K AI Cinema Preview",
                                    fontSize = 11.sp,
                                    color = Color.LightGray
                                )
                            }

                            // Live Video Tag
                            Surface(
                                color = Color.Black.copy(alpha = 0.8f),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier
                                    .align(Alignment.TopStart)
                                    .padding(8.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .background(CyberCyan, shape = CircleShape)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "🎬 LIVE AI VIDEO",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        color = CyberCyan
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = video.tag,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = CyberCyan
                            )
                            Text(
                                text = video.model,
                                fontSize = 11.sp,
                                color = ElectricPurple
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = video.title,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = video.prompt,
                            fontSize = 12.sp,
                            color = Color.LightGray,
                            maxLines = 2
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "👁️ ${video.views}   ❤️ ${video.likes}",
                                fontSize = 11.sp,
                                color = Color.Gray
                            )

                            Button(
                                onClick = { prompt = video.prompt },
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = CyberCyan.copy(alpha = 0.15f)),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "Use Prompt",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CyberCyan
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    val popularVideos = remember {
        listOf(
            ShowcaseVideoItem("Cyberpunk Neo-Tokyo Rain", "Cinematic hyper-detailed neo-Tokyo cyberpunk alley at night, torrential neon rain, holographic dragons, 35mm lens", "11Cinema-Ultra-v2", "Trending AI Cinema", "48.2K", "8.4K"),
            ShowcaseVideoItem("Quantum Abyss Leviathan", "Bioluminescent colossal whale navigating through liquid crystalline starlight in deep space, glowing tentacles", "11Luma-Diffusion-X", "Editor Choice", "62.9K", "14.1K"),
            ShowcaseVideoItem("Solarpunk Titan Forest", "Towering biomechanical glass redwood trees absorbing sunlight, solar particles shimmering in mist", "11Sora-Gen-Prime", "Photorealistic", "33.4K", "6.7K"),
            ShowcaseVideoItem("Desert Mirage Hypercar", "Liquid mercury hypercar cruising across obsidian desert at twilight, heat distortion, trailing cyan lasers", "11Kling-Motion-Studio", "Motion VFX", "51.8K", "9.3K"),
            ShowcaseVideoItem("Obsidian Oracle Awakening", "Hyper-realistic cybernetic oracle sculpted from obsidian and radiant gold filigree, glowing neon eyes awakening", "11Runway-Gen3-Alpha", "AI Character Motion", "71.5K", "18.9K"),
            ShowcaseVideoItem("Quantum Neural Synapse", "Macro camera fly-through inside quantum neural processor, pulsing violet and emerald synapses", "11FLUX-Motion-Pro", "Quantum VFX", "39.0K", "7.8K"),
            ShowcaseVideoItem("Cosmic Horizon Singularity", "Interstellar accretion disk spinning around supermassive black hole, gravitational lensing bending starlight", "11Hailuo-MiniMax", "Sci-Fi Epic", "84.1K", "22.3K"),
            ShowcaseVideoItem("Cyber Samurai Neon Duel", "Cyber samurai with energized plasma katana in torrential rain, neon reflections on wet asphalt", "11Pika-Cinematic-v2", "Action Motion", "56.7K", "12.8K")
        )
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
