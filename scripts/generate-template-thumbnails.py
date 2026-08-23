import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = r"d:\Signhify\public\images\templates"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 1280, 720

def create_base_canvas(bg_color1, bg_color2, accent_color, mode="radial"):
    """Creates a base background with smooth gradient and ambient light."""
    img = Image.new("RGBA", (WIDTH, HEIGHT), bg_color1)
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Linear background gradient
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(bg_color1[0] * (1 - t) + bg_color2[0] * t)
        g = int(bg_color1[1] * (1 - t) + bg_color2[1] * t)
        b = int(bg_color1[2] * (1 - t) + bg_color2[2] * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

    img = Image.alpha_composite(img, overlay)

    # Ambient center / corner glow
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx, cy = WIDTH // 2, HEIGHT // 2
    max_radius = 450
    for r in range(max_radius, 0, -15):
        alpha = int(45 * (1 - r / max_radius))
        glow_draw.ellipse(
            [cx - r * 1.5, cy - r, cx + r * 1.5, cy + r],
            fill=(accent_color[0], accent_color[1], accent_color[2], alpha),
        )
    glow = glow.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img, glow)
    return img

def draw_perspective_grid(draw, accent_color, horizon_y=HEIGHT//2 + 80):
    """Draws a futuristic perspective grid floor."""
    grid_color = (accent_color[0], accent_color[1], accent_color[2], 30)
    vp_x = WIDTH // 2

    # Perspective lines from vanishing point
    for x in range(-WIDTH, WIDTH * 2, 80):
        draw.line([(vp_x, horizon_y), (x, HEIGHT)], fill=grid_color, width=1)

    # Horizontal lines with increasing spacing
    y = horizon_y
    step = 4
    while y < HEIGHT:
        alpha = int(10 + 40 * ((y - horizon_y) / (HEIGHT - horizon_y)))
        h_color = (accent_color[0], accent_color[1], accent_color[2], alpha)
        draw.line([(0, int(y)), (WIDTH, int(y))], fill=h_color, width=1)
        step = step * 1.35 + 2
        y += step

def draw_dots_matrix(draw, accent_color, step=40):
    """Draws a subtle dot grid."""
    for x in range(20, WIDTH, step):
        for y in range(20, HEIGHT, step):
            draw.ellipse([x, y, x + 2, y + 2], fill=(255, 255, 255, 18))

def draw_hud_frame(draw, title, category, tag, accent_color, frames=480):
    """Draws sleek cyber telemetry HUD corners and borders."""
    # Top-left badge
    draw.rounded_rectangle([40, 40, 260, 75], radius=8, fill=(10, 15, 25, 200), outline=(accent_color[0], accent_color[1], accent_color[2], 120), width=1)
    draw.ellipse([55, 53, 65, 63], fill=(accent_color[0], accent_color[1], accent_color[2], 255))
    draw.text((75, 48), f"SIGNHIFY 3D · {category.upper()}", fill=(220, 240, 230, 220))

    # Top-right badge
    draw.rounded_rectangle([WIDTH - 240, 40, WIDTH - 40, 75], radius=8, fill=(10, 15, 25, 200), outline=(255, 255, 255, 40), width=1)
    draw.text((WIDTH - 220, 48), f"{frames} FRAMES · 60 FPS", fill=(accent_color[0], accent_color[1], accent_color[2], 240))

    # Bottom title overlay card
    draw.rounded_rectangle([40, HEIGHT - 110, WIDTH - 40, HEIGHT - 40], radius=12, fill=(6, 10, 18, 220), outline=(accent_color[0], accent_color[1], accent_color[2], 80), width=1)
    draw.text((65, HEIGHT - 95), title, fill=(255, 255, 255, 250))
    draw.text((65, HEIGHT - 65), f"Tag: {tag}  |  Interactive 3D Frame Scrub  |  Zero Latency", fill=(160, 180, 195, 200))

    # Corner ticks
    tick_col = (accent_color[0], accent_color[1], accent_color[2], 180)
    draw.line([(25, 25), (60, 25)], fill=tick_col, width=2)
    draw.line([(25, 25), (25, 60)], fill=tick_col, width=2)
    draw.line([(WIDTH - 25, 25), (WIDTH - 60, 25)], fill=tick_col, width=2)
    draw.line([(WIDTH - 25, 25), (WIDTH - 25, 60)], fill=tick_col, width=2)
    draw.line([(25, HEIGHT - 25), (60, HEIGHT - 25)], fill=tick_col, width=2)
    draw.line([(25, HEIGHT - 25), (25, HEIGHT - 60)], fill=tick_col, width=2)
    draw.line([(WIDTH - 25, HEIGHT - 25), (WIDTH - 60, HEIGHT - 25)], fill=tick_col, width=2)
    draw.line([(WIDTH - 25, HEIGHT - 25), (WIDTH - 25, HEIGHT - 60)], fill=tick_col, width=2)


# ─────────────────────────────────────────────────────────────────────────────
# 1. Cyberpunk Kinetic Watch
# ─────────────────────────────────────────────────────────────────────────────
def gen_cyberpunk_kinetic_watch():
    img = create_base_canvas((3, 7, 18), (10, 24, 16), (34, 197, 94))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_perspective_grid(draw, (34, 197, 94))
    draw_dots_matrix(draw, (34, 197, 94))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20
    # Outer watch case
    draw.ellipse([cx - 210, cy - 210, cx + 210, cy + 210], fill=(12, 18, 28, 240), outline=(34, 197, 94, 200), width=4)
    draw.ellipse([cx - 185, cy - 185, cx + 185, cy + 185], outline=(74, 222, 128, 140), width=2)
    draw.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], fill=(6, 10, 16, 255), outline=(34, 197, 94, 90), width=2)

    # Exploded sub-assembly rings
    for offset, alpha in [(-70, 70), (-35, 120), (35, 120), (70, 70)]:
        draw.ellipse([cx - 170 + offset//2, cy - 170 + offset, cx + 170 + offset//2, cy + 170 + offset], outline=(34, 197, 94, alpha), width=1)

    # Mechanical gears
    for r, teeth in [(90, 16), (55, 12), (30, 8)]:
        for i in range(teeth):
            ang = i * (2 * math.pi / teeth)
            x1 = cx + (r - 10) * math.cos(ang)
            y1 = cy + (r - 10) * math.sin(ang)
            x2 = cx + (r + 12) * math.cos(ang)
            y2 = cy + (r + 12) * math.sin(ang)
            draw.line([(x1, y1), (x2, y2)], fill=(74, 222, 128, 180), width=4)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(74, 222, 128, 220), width=2)

    # Watch hands with neon glow
    draw.line([(cx, cy), (cx + 95, cy - 65)], fill=(255, 255, 255, 255), width=4)
    draw.line([(cx, cy), (cx - 70, cy + 60)], fill=(74, 222, 128, 255), width=3)
    draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=(255, 255, 255, 255))

    # Hour markers
    for i in range(12):
        ang = i * (math.pi / 6)
        hx1 = cx + 135 * math.cos(ang)
        hy1 = cy + 135 * math.sin(ang)
        hx2 = cx + 155 * math.cos(ang)
        hy2 = cy + 155 * math.sin(ang)
        draw.line([(hx1, hy1), (hx2, hy2)], fill=(34, 197, 94, 255), width=3)

    draw_hud_frame(draw, "Cyberpunk Kinetic Watch Atelier", "3D Scroll", "Precision Timepiece", (34, 197, 94), 480)
    img.save(os.path.join(OUTPUT_DIR, "cyberpunk-kinetic-watch.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 2. Zenith Spatial AR Headset
# ─────────────────────────────────────────────────────────────────────────────
def gen_zenith_spatial_headset():
    img = create_base_canvas((2, 6, 23), (6, 20, 30), (45, 212, 191))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (45, 212, 191))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 30

    # Spatial LiDAR mesh & rays
    for i in range(-12, 13):
        ang = i * 0.12
        rx = cx + 320 * math.sin(ang)
        ry = cy + 220 * math.cos(ang)
        draw.line([(cx, cy - 20), (rx, ry)], fill=(45, 212, 191, 40), width=1)

    # Curved Glass Visor 3D Shell
    draw.arc([cx - 240, cy - 130, cx + 240, cy + 110], 0, 180, fill=(45, 212, 191, 240), width=5)
    draw.arc([cx - 220, cy - 110, cx + 220, cy + 90], 0, 180, fill=(34, 197, 94, 180), width=3)
    draw.chord([cx - 230, cy - 80, cx + 230, cy + 80], 0, 180, fill=(10, 20, 35, 220), outline=(45, 212, 191, 200), width=2)

    # Dual Micro-OLED Lens Glow
    draw.ellipse([cx - 120, cy - 20, cx - 20, cy + 50], fill=(6, 12, 24, 255), outline=(45, 212, 191, 220), width=3)
    draw.ellipse([cx + 20, cy - 20, cx + 120, cy + 50], fill=(6, 12, 24, 255), outline=(45, 212, 191, 220), width=3)
    draw.ellipse([cx - 85, cy + 5, cx - 55, cy + 25], fill=(255, 255, 255, 220))
    draw.ellipse([cx + 55, cy + 5, cx + 85, cy + 25], fill=(255, 255, 255, 220))

    # Floating UI cards in spatial space
    draw.rounded_rectangle([cx - 360, cy - 100, cx - 210, cy - 10], radius=8, fill=(15, 30, 45, 190), outline=(45, 212, 191, 140), width=1)
    draw.text((cx - 345, cy - 85), "Spatial Audio 120Hz", fill=(255, 255, 255, 220))
    draw.text((cx - 345, cy - 60), "64 PPD Dual OLED", fill=(45, 212, 191, 200))

    draw.rounded_rectangle([cx + 210, cy - 100, cx + 360, cy - 10], radius=8, fill=(15, 30, 45, 190), outline=(74, 222, 128, 140), width=1)
    draw.text((cx + 225, cy - 85), "Latency: <12ms", fill=(255, 255, 255, 220))
    draw.text((cx + 225, cy - 60), "Weight: 310g Carbon", fill=(74, 222, 128, 200))

    draw_hud_frame(draw, "Zenith Spatial AR Headset", "3D Scroll", "Vision Pro / AR Interface", (45, 212, 191), 540)
    img.save(os.path.join(OUTPUT_DIR, "zenith-spatial-headset.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 3. Titanium EV Supercar
# ─────────────────────────────────────────────────────────────────────────────
def gen_titanium_ev_supercar():
    img = create_base_canvas((2, 8, 4), (10, 18, 12), (34, 197, 94))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_perspective_grid(draw, (34, 197, 94), horizon_y=HEIGHT//2 + 40)

    cx, cy = WIDTH // 2, HEIGHT // 2 - 10

    # Aerodynamic wind tunnel streamlines
    for i in range(-8, 9):
        y_offset = i * 22
        points = [
            (80, cy + y_offset - 40),
            (cx - 200, cy + y_offset - 20),
            (cx, cy + y_offset * 0.4),
            (cx + 260, cy + y_offset * 0.7),
            (WIDTH - 80, cy + y_offset + 30)
        ]
        draw.line(points, fill=(74, 222, 128, 45), width=2)

    # Sleek Hypercar Silhouette
    car_body = [
        (cx - 320, cy + 70),
        (cx - 280, cy + 35),
        (cx - 160, cy - 10),
        (cx - 30, cy - 60),
        (cx + 100, cy - 60),
        (cx + 210, cy - 10),
        (cx + 310, cy + 35),
        (cx + 335, cy + 70),
        (cx + 280, cy + 70),
        (cx + 250, cy + 40),
        (cx + 180, cy + 40),
        (cx + 150, cy + 70),
        (cx - 150, cy + 70),
        (cx - 180, cy + 40),
        (cx - 250, cy + 40),
        (cx - 280, cy + 70),
    ]
    draw.polygon(car_body, fill=(12, 18, 24, 255), outline=(34, 197, 94, 220))

    # Cabin glass
    cockpit = [(cx - 100, cy - 10), (cx - 20, cy - 50), (cx + 80, cy - 50), (cx + 160, cy - 10)]
    draw.polygon(cockpit, fill=(4, 8, 14, 240), outline=(74, 222, 128, 160))

    # Laser green headlights & underglow
    draw.line([(cx - 300, cy + 45), (cx - 240, cy + 45)], fill=(74, 222, 128, 255), width=4)
    draw.line([(cx + 240, cy + 45), (cx + 300, cy + 45)], fill=(34, 197, 94, 255), width=4)
    draw.ellipse([cx - 230, cy + 30, cx - 170, cy + 85], fill=(8, 10, 14, 255), outline=(34, 197, 94, 200), width=3)
    draw.ellipse([cx + 170, cy + 30, cx + 230, cy + 85], fill=(8, 10, 14, 255), outline=(34, 197, 94, 200), width=3)

    # 0-60 MPH Telemetry overlay
    draw.rounded_rectangle([cx - 120, cy + 90, cx + 120, cy + 135], radius=6, fill=(10, 20, 15, 220), outline=(34, 197, 94, 160), width=1)
    draw.text((cx - 105, cy + 100), "0-60: 1.89s  |  1,900 HP  |  0.208 Cd", fill=(74, 222, 128, 255))

    draw_hud_frame(draw, "Apex Hyperion EV Supercar", "3D Scroll", "Automotive Aerodynamics", (34, 197, 94), 600)
    img.save(os.path.join(OUTPUT_DIR, "titanium-ev-supercar.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 4. Deep Sea Bioluminescence
# ─────────────────────────────────────────────────────────────────────────────
def gen_deep_sea_bioluminescence():
    img = create_base_canvas((1, 10, 18), (2, 28, 32), (45, 212, 191))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (45, 212, 191), step=50)

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Sonar radar rings
    for r in [80, 160, 240, 320]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(45, 212, 191, 40), width=1)
    draw.line([(cx, cy - 320), (cx, cy + 320)], fill=(45, 212, 191, 30), width=1)
    draw.line([(cx - 320, cy), (cx + 320, cy)], fill=(45, 212, 191, 30), width=1)

    # Submersible Sphere
    draw.ellipse([cx - 120, cy - 120, cx + 120, cy + 120], fill=(8, 20, 28, 255), outline=(45, 212, 191, 220), width=4)
    draw.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], fill=(2, 8, 14, 255), outline=(34, 197, 94, 180), width=3)
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=(45, 212, 191, 180))

    # Bioluminescent Organisms / Floating Jellies
    random.seed(42)
    for _ in range(25):
        jx = random.randint(80, WIDTH - 80)
        jy = random.randint(80, HEIGHT - 140)
        jr = random.randint(6, 18)
        draw.ellipse([jx - jr, jy - jr, jx + jr, jy + jr], fill=(45, 212, 191, 180), outline=(255, 255, 255, 220))
        for t in range(4):
            draw.line([(jx - 4 + t * 3, jy + jr), (jx - 6 + t * 4, jy + jr + 16)], fill=(34, 197, 94, 140), width=1)

    # Depth Gauge
    draw.rounded_rectangle([WIDTH - 240, 110, WIDTH - 60, 200], radius=8, fill=(8, 18, 25, 220), outline=(45, 212, 191, 140), width=1)
    draw.text((WIDTH - 225, 125), "DEPTH: 10,928m", fill=(255, 255, 255, 255))
    draw.text((WIDTH - 225, 150), "PRESSURE: 1,086 bar", fill=(45, 212, 191, 220))
    draw.text((WIDTH - 225, 175), "HULL: Grade-5 Ti", fill=(74, 222, 128, 200))

    draw_hud_frame(draw, "Abyssal Bio-Synth Submersible", "3D Scroll", "Marine Exploration & Depth", (45, 212, 191), 420)
    img.save(os.path.join(OUTPUT_DIR, "deep-sea-bioluminescence.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 5. Nova AI Code Copilot & IDE
# ─────────────────────────────────────────────────────────────────────────────
def gen_nova_ai_code_copilot():
    img = create_base_canvas((3, 7, 14), (5, 18, 14), (34, 197, 94))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (34, 197, 94))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # IDE Window Frame
    draw.rounded_rectangle([cx - 360, cy - 170, cx + 360, cy + 150], radius=12, fill=(8, 12, 20, 250), outline=(34, 197, 94, 140), width=2)
    # Window Header
    draw.rectangle([cx - 360, cy - 170, cx + 360, cy - 130], fill=(14, 20, 32, 255))
    draw.ellipse([cx - 340, cy - 155, cx - 330, cy - 145], fill=(239, 68, 68, 255))
    draw.ellipse([cx - 322, cy - 155, cx - 312, cy - 145], fill=(234, 179, 8, 255))
    draw.ellipse([cx - 304, cy - 155, cx - 294, cy - 145], fill=(34, 197, 94, 255))
    draw.text((cx - 120, cy - 155), "App.tsx — Nova AI Autonomous Agent", fill=(200, 210, 225, 200))

    # Code Editor Pane (Left)
    draw.line([(cx + 40, cy - 130), (cx + 40, cy + 150)], fill=(34, 197, 94, 50), width=1)
    code_lines = [
        ("import { useAgentStream } from '@signhify/ai';", (134, 239, 172)),
        ("const agent = new AutonomousCopilot({", (255, 255, 255)),
        ("  model: 'claude-3.7-sonnet-r1',", (74, 222, 128)),
        ("  byokVault: 'aes-256-gcm',", (56, 189, 248)),
        ("  telemetry: { maxQps: 50000 }", (250, 204, 21)),
        ("});", (255, 255, 255)),
        ("export async function deploy() {", (134, 239, 172)),
        ("  await agent.compileScrollSite();", (74, 222, 128)),
        ("}", (255, 255, 255))
    ]
    for idx, (line, col) in enumerate(code_lines):
        draw.text((cx - 330, cy - 110 + idx * 26), f"{idx+1:02d}  {line}", fill=col)

    # Terminal / AI Stream Pane (Right)
    draw.rounded_rectangle([cx + 60, cy - 110, cx + 340, cy + 130], radius=8, fill=(4, 8, 14, 240), outline=(34, 197, 94, 90), width=1)
    draw.text((cx + 80, cy - 95), "> STREAMING AI TOKENS...", fill=(34, 197, 94, 255))
    draw.text((cx + 80, cy - 65), "✓ Syntax verified [100%]", fill=(74, 222, 128, 220))
    draw.text((cx + 80, cy - 40), "✓ 480 frames generated", fill=(56, 189, 248, 220))
    draw.text((cx + 80, cy - 15), "✓ Cloudflare edge deployed", fill=(250, 204, 21, 220))
    draw.text((cx + 80, cy + 20), "Latency: 2.4ms | Tokens: 4,820", fill=(160, 180, 200, 180))

    # Live cursor blink
    draw.rectangle([cx + 80, cy + 60, cx + 90, cy + 80], fill=(34, 197, 94, 255))

    draw_hud_frame(draw, "Nova AI Code Copilot & IDE", "SaaS & AI", "Full-Stack Devtools Platform", (34, 197, 94), 360)
    img.save(os.path.join(OUTPUT_DIR, "nova-ai-code-copilot.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 6. Apex Swarm AI Orchestrator
# ─────────────────────────────────────────────────────────────────────────────
def gen_apex_swarm_ai_orchestrator():
    img = create_base_canvas((4, 6, 14), (8, 20, 16), (74, 222, 128))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (74, 222, 128))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Multi-Agent DAG Graph Nodes
    nodes = [
        (cx - 260, cy, "PLANNER", (56, 189, 248)),
        (cx - 90, cy - 80, "RESEARCH", (74, 222, 128)),
        (cx - 90, cy + 80, "CODER", (34, 197, 94)),
        (cx + 90, cy - 40, "QA TESTER", (250, 204, 21)),
        (cx + 90, cy + 40, "SECURITY", (168, 85, 247)),
        (cx + 260, cy, "DEPLOYER", (34, 197, 94)),
    ]

    # Connections between DAG nodes
    draw.line([(cx - 260, cy), (cx - 90, cy - 80)], fill=(74, 222, 128, 180), width=3)
    draw.line([(cx - 260, cy), (cx - 90, cy + 80)], fill=(74, 222, 128, 180), width=3)
    draw.line([(cx - 90, cy - 80), (cx + 90, cy - 40)], fill=(74, 222, 128, 180), width=3)
    draw.line([(cx - 90, cy + 80), (cx + 90, cy + 40)], fill=(74, 222, 128, 180), width=3)
    draw.line([(cx + 90, cy - 40), (cx + 260, cy)], fill=(74, 222, 128, 180), width=3)
    draw.line([(cx + 90, cy + 40), (cx + 260, cy)], fill=(74, 222, 128, 180), width=3)

    for nx, ny, label, col in nodes:
        draw.ellipse([nx - 45, ny - 45, nx + 45, ny + 45], fill=(10, 16, 26, 255), outline=col, width=3)
        draw.ellipse([nx - 12, ny - 12, nx + 12, ny + 12], fill=col)
        draw.text((nx - 35, ny + 55), label, fill=(255, 255, 255, 240))

    # Swarm Telemetry metrics top bar
    draw.rounded_rectangle([cx - 200, 95, cx + 200, 135], radius=6, fill=(12, 20, 30, 220), outline=(74, 222, 128, 120), width=1)
    draw.text((cx - 180, 107), "6 SWARMS ACTIVE · $0.0042/s · 94.2% CACHE HIT", fill=(74, 222, 128, 255))

    draw_hud_frame(draw, "Apex Swarm AI Orchestrator", "SaaS & AI", "Agent Fleet Command Center", (74, 222, 128), 300)
    img.save(os.path.join(OUTPUT_DIR, "apex-swarm-ai-orchestrator.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 7. Synthetix Voice AI Canvas
# ─────────────────────────────────────────────────────────────────────────────
def gen_synthetix_voice_ai_canvas():
    img = create_base_canvas((4, 10, 16), (2, 24, 20), (52, 211, 153))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (52, 211, 153))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # 3D Glowing Voice Sphere
    draw.ellipse([cx - 110, cy - 110, cx + 110, cy + 110], fill=(8, 24, 24, 255), outline=(52, 211, 153, 220), width=4)
    for r in [130, 150, 175]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(52, 211, 153, int(150 * (1 - r/200))), width=1)

    # Audio waveform bars
    num_bars = 48
    for i in range(num_bars):
        ang = i * (2 * math.pi / num_bars)
        amp = 20 + 40 * math.sin(i * 0.8) ** 2
        bx1 = cx + 115 * math.cos(ang)
        by1 = cy + 115 * math.sin(ang)
        bx2 = cx + (115 + amp) * math.cos(ang)
        by2 = cy + (115 + amp) * math.sin(ang)
        draw.line([(bx1, by1), (bx2, by2)], fill=(52, 211, 153, 200), width=3)

    # Latency badge
    draw.rounded_rectangle([cx - 100, cy + 140, cx + 100, cy + 180], radius=8, fill=(10, 25, 20, 220), outline=(52, 211, 153, 160), width=1)
    draw.text((cx - 85, cy + 152), "< 240ms Roundtrip Voice", fill=(255, 255, 255, 255))

    draw_hud_frame(draw, "Synthetix Real-Time Voice AI", "SaaS & AI", "Low-Latency Conversational Audio", (52, 211, 153), 340)
    img.save(os.path.join(OUTPUT_DIR, "synthetix-voice-ai-canvas.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 8. VectorFlow Neural RAG Engine
# ─────────────────────────────────────────────────────────────────────────────
def gen_vectorflow_rag_pipeline():
    img = create_base_canvas((3, 8, 14), (6, 24, 20), (110, 231, 183))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (110, 231, 183))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # 3D Vector Point Cloud Clusters
    random.seed(101)
    cluster_centers = [(cx - 180, cy - 60), (cx, cy + 40), (cx + 180, cy - 50)]
    all_points = []
    for ccx, ccy in cluster_centers:
        for _ in range(35):
            px = ccx + random.randint(-70, 70)
            py = ccy + random.randint(-60, 60)
            all_points.append((px, py))
            draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=(110, 231, 183, 220))

    # Cluster connecting lines
    for i in range(len(all_points) - 1):
        p1 = all_points[i]
        p2 = all_points[i + 1]
        dist = math.hypot(p1[0] - p2[0], p1[1] - p2[1])
        if dist < 65:
            draw.line([p1, p2], fill=(110, 231, 183, 60), width=1)

    # Search Vector Ray
    draw.line([(cx - 280, cy + 120), (cx + 180, cy - 50)], fill=(255, 255, 255, 220), width=3)
    draw.ellipse([cx + 172, cy - 58, cx + 188, cy - 42], fill=(234, 179, 8, 255), outline=(255, 255, 255, 255), width=2)
    draw.text((cx + 200, cy - 55), "Cosine: 0.942 Similarity", fill=(234, 179, 8, 255))

    draw_hud_frame(draw, "VectorFlow Neural RAG Engine", "SaaS & AI", "High-Throughput Vector DB", (110, 231, 183), 320)
    img.save(os.path.join(OUTPUT_DIR, "vectorflow-rag-pipeline.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 9. Orbital Quantum Cloud
# ─────────────────────────────────────────────────────────────────────────────
def gen_orbital_quantum_compute():
    img = create_base_canvas((2, 4, 10), (8, 28, 20), (134, 239, 172))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (134, 239, 172))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 30

    # Dilution refrigerator chandelier
    for i in range(6):
        w = 340 - i * 45
        y = cy - 120 + i * 40
        draw.rectangle([cx - w//2, y, cx + w//2, y + 10], fill=(212, 175, 55, 240), outline=(134, 239, 172, 180), width=1)
        # Golden copper tubes
        for tx in range(cx - w//2 + 20, cx + w//2 - 10, 30):
            draw.line([(tx, y + 10), (tx, y + 40)], fill=(212, 175, 55, 180), width=2)

    # Qubit lattice at bottom
    lattice_y = cy + 120
    draw.ellipse([cx - 90, lattice_y - 30, cx + 90, lattice_y + 30], fill=(6, 15, 20, 255), outline=(134, 239, 172, 220), width=2)
    draw.text((cx - 75, lattice_y - 8), "0.015 KELVIN CRYOGENIC", fill=(134, 239, 172, 255))

    draw_hud_frame(draw, "Orbital Quantum Cloud", "Cinematic Landing", "Cryogenic Qubit Infrastructure", (134, 239, 172), 520)
    img.save(os.path.join(OUTPUT_DIR, "orbital-quantum-compute.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 10. Hyperion Space Launch
# ─────────────────────────────────────────────────────────────────────────────
def gen_hyperion_space_launch():
    img = create_base_canvas((3, 10, 16), (8, 24, 18), (74, 222, 128))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_perspective_grid(draw, (74, 222, 128))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Rocket Body
    draw.polygon([
        (cx - 25, cy + 110),
        (cx - 25, cy - 70),
        (cx, cy - 140),
        (cx + 25, cy - 70),
        (cx + 25, cy + 110)
    ], fill=(220, 230, 240, 255), outline=(74, 222, 128, 200), width=2)

    # Booster fins
    draw.polygon([(cx - 25, cy + 70), (cx - 55, cy + 120), (cx - 25, cy + 110)], fill=(34, 197, 94, 220))
    draw.polygon([(cx + 25, cy + 70), (cx + 55, cy + 120), (cx + 25, cy + 110)], fill=(34, 197, 94, 220))

    # Mach 3 Shock Diamonds Thrust Flame
    for fi in range(4):
        fy = cy + 125 + fi * 25
        fw = 20 - fi * 3
        draw.polygon([(cx, fy - 10), (cx - fw, fy), (cx, fy + 15), (cx + fw, fy)], fill=(74, 222, 128, 220))

    # Ascent Telemetry HUD
    draw.rounded_rectangle([100, 120, 320, 200], radius=8, fill=(10, 20, 25, 220), outline=(74, 222, 128, 120), width=1)
    draw.text((115, 135), "ALTITUDE: 72.4 km", fill=(255, 255, 255, 255))
    draw.text((115, 155), "SPEED: Mach 4.2", fill=(74, 222, 128, 220))
    draw.text((115, 175), "STAGE SEPARATION: T+140s", fill=(56, 189, 248, 200))

    draw_hud_frame(draw, "Hyperion Orbital Propulsion", "Cinematic Landing", "Heavy Aerospace Launch System", (74, 222, 128), 580)
    img.save(os.path.join(OUTPUT_DIR, "hyperion-space-launch.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 11. Monolith Luxury Architecture
# ─────────────────────────────────────────────────────────────────────────────
def gen_monolith_luxury_architecture():
    img = create_base_canvas((10, 16, 14), (5, 8, 12), (167, 243, 208))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (167, 243, 208))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 10

    # Brutalist cantilevered residence slabs
    draw.polygon([(cx - 300, cy + 90), (cx - 40, cy + 90), (cx + 40, cy + 20), (cx - 220, cy + 20)], fill=(30, 35, 42, 255), outline=(167, 243, 208, 140), width=2)
    draw.polygon([(cx - 180, cy + 20), (cx + 180, cy + 20), (cx + 260, cy - 60), (cx - 100, cy - 60)], fill=(20, 26, 32, 255), outline=(167, 243, 208, 180), width=2)
    draw.polygon([(cx - 60, cy - 60), (cx + 280, cy - 60), (cx + 340, cy - 130), (cx, cy - 130)], fill=(12, 18, 22, 255), outline=(167, 243, 208, 220), width=2)

    # Floor-to-ceiling glowing emerald glass windows
    draw.polygon([(cx - 140, cy + 15), (cx + 140, cy + 15), (cx + 160, cy - 50), (cx - 120, cy - 50)], fill=(34, 197, 94, 90), outline=(167, 243, 208, 200), width=1)

    draw_hud_frame(draw, "Monolith Spatial Architecture", "Cinematic Landing", "Brutalist Cliffside Atelier", (167, 243, 208), 460)
    img.save(os.path.join(OUTPUT_DIR, "monolith-luxury-architecture.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 12. Vortex Spatial Audio Headphones
# ─────────────────────────────────────────────────────────────────────────────
def gen_vortex_wireless_audio():
    img = create_base_canvas((4, 8, 14), (10, 24, 18), (34, 197, 94))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (34, 197, 94))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Acoustic wave rings
    for r in [100, 160, 220, 280]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(34, 197, 94, int(160 * (1 - r/320))), width=2)

    # Exploded headphone drivers & headband
    draw.arc([cx - 180, cy - 190, cx + 180, cy + 40], 180, 360, fill=(74, 222, 128, 220), width=8)

    # Left & right earcups
    draw.ellipse([cx - 210, cy - 40, cx - 110, cy + 90], fill=(12, 18, 24, 255), outline=(34, 197, 94, 220), width=4)
    draw.ellipse([cx + 110, cy - 40, cx + 210, cy + 90], fill=(12, 18, 24, 255), outline=(34, 197, 94, 220), width=4)

    # Center beryllium driver exploded diaphragm
    draw.ellipse([cx - 60, cy - 40, cx + 60, cy + 80], fill=(8, 12, 18, 255), outline=(74, 222, 128, 240), width=3)
    draw.ellipse([cx - 25, cy - 5, cx + 25, cy + 45], fill=(34, 197, 94, 200))

    # Frequency response curve
    f_points = [(cx - 280 + i * 12, cy + 140 + int(30 * math.sin(i * 0.4))) for i in range(48)]
    draw.line(f_points, fill=(74, 222, 128, 220), width=2)

    draw_hud_frame(draw, "Vortex Spatial Audio Headphones", "E-Commerce", "Beryllium Driver Acoustic Hardware", (34, 197, 94), 420)
    img.save(os.path.join(OUTPUT_DIR, "vortex-wireless-audio.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 13. Lumina Holographic Lightfield
# ─────────────────────────────────────────────────────────────────────────────
def gen_lumina_holographic_display():
    img = create_base_canvas((4, 12, 20), (2, 26, 24), (52, 211, 153))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_perspective_grid(draw, (52, 211, 153))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Display base pedestal
    draw.polygon([(cx - 240, cy + 110), (cx + 240, cy + 110), (cx + 280, cy + 150), (cx - 280, cy + 150)], fill=(15, 25, 35, 255), outline=(52, 211, 153, 200), width=2)

    # Holographic light projection cone
    draw.polygon([(cx - 180, cy + 110), (cx + 180, cy + 110), (cx + 260, cy - 100), (cx - 260, cy - 100)], fill=(52, 211, 153, 30), outline=(52, 211, 153, 90), width=1)

    # 3D Floating Wireframe Crystal
    c_pts = [
        (cx, cy - 90), (cx - 80, cy - 10), (cx, cy + 40), (cx + 80, cy - 10),
        (cx, cy - 90), (cx, cy + 40), (cx - 80, cy - 10), (cx + 80, cy - 10)
    ]
    draw.line(c_pts, fill=(52, 211, 153, 255), width=3)
    draw.ellipse([cx - 8, cy - 25, cx + 8, cy - 9], fill=(255, 255, 255, 255))

    draw_hud_frame(draw, "Lumina Holographic Lightfield", "E-Commerce", "Glasses-Free 3D Spatial Display", (52, 211, 153), 450)
    img.save(os.path.join(OUTPUT_DIR, "lumina-holographic-display.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 14. Chronos Carbon Fiber Runner
# ─────────────────────────────────────────────────────────────────────────────
def gen_chronos_luxury_sneaker():
    img = create_base_canvas((5, 10, 16), (10, 24, 16), (74, 222, 128))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_perspective_grid(draw, (74, 222, 128))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 10

    # 3D Printed Sneaker Silhouette
    shoe = [
        (cx - 260, cy + 50),
        (cx - 240, cy - 10),
        (cx - 140, cy - 60),
        (cx - 60, cy - 40),
        (cx + 100, cy + 10),
        (cx + 240, cy + 30),
        (cx + 270, cy + 60),
        (cx + 210, cy + 60),
        (cx + 120, cy + 45),
        (cx - 80, cy + 45),
        (cx - 260, cy + 60),
    ]
    draw.polygon(shoe, fill=(16, 22, 28, 255), outline=(74, 222, 128, 220), width=3)

    # 3D Printed Lattice Midsole Mesh
    for x in range(cx - 240, cx + 220, 20):
        draw.line([(x, cy + 45), (x + 10, cy + 65)], fill=(74, 222, 128, 180), width=2)
        draw.line([(x + 10, cy + 45), (x, cy + 65)], fill=(34, 197, 94, 180), width=2)

    # Energy Return badge
    draw.rounded_rectangle([cx - 90, cy + 90, cx + 90, cy + 130], radius=6, fill=(10, 20, 18, 220), outline=(74, 222, 128, 140), width=1)
    draw.text((cx - 75, cy + 102), "88.4% Energy Return · 185g", fill=(74, 222, 128, 255))

    draw_hud_frame(draw, "Chronos Carbon Fiber Runner", "E-Commerce", "3D-Printed Lattice Footwear", (74, 222, 128), 380)
    img.save(os.path.join(OUTPUT_DIR, "chronos-luxury-sneaker.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 15. Solaris Renewable Energy Grid
# ─────────────────────────────────────────────────────────────────────────────
def gen_solaris_renewable_energy_grid():
    img = create_base_canvas((4, 12, 14), (8, 24, 18), (134, 239, 172))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (134, 239, 172))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Solar area telemetry curves
    for y_base, col in [(cy + 80, (134, 239, 172, 160)), (cy + 40, (34, 197, 94, 180)), (cy, (250, 204, 21, 190))]:
        pts = [(100 + i * 24, y_base - int(45 * math.sin(i * 0.2))) for i in range(46)]
        draw.line(pts, fill=col, width=3)

    # MegaWatt generation dials
    for idx, (title, val) in enumerate([("SOLAR PV", "840 MW"), ("WIND TURBINE", "580 MW"), ("BATTERY RESERVE", "850 MWh")]):
        bx = cx - 260 + idx * 260
        draw.rounded_rectangle([bx - 100, cy - 130, bx + 100, cy - 60], radius=8, fill=(10, 18, 22, 220), outline=(134, 239, 172, 140), width=1)
        draw.text((bx - 80, cy - 118), title, fill=(160, 190, 180, 200))
        draw.text((bx - 80, cy - 90), val, fill=(255, 255, 255, 255))

    draw_hud_frame(draw, "Solaris Renewable Energy Grid", "Dashboards", "Clean Energy Telemetry IoT", (134, 239, 172), 320)
    img.save(os.path.join(OUTPUT_DIR, "solaris-renewable-energy-grid.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 16. HyperFlow Global Treasury & FX
# ─────────────────────────────────────────────────────────────────────────────
def gen_hyperflow_fintech_cloud():
    img = create_base_canvas((3, 8, 14), (6, 22, 18), (34, 197, 94))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (34, 197, 94))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # FX Candlestick Chart
    random.seed(88)
    for i in range(26):
        bx = cx - 320 + i * 25
        open_y = cy + random.randint(-40, 40)
        close_y = open_y + random.randint(-35, 35)
        high_y = min(open_y, close_y) - random.randint(5, 25)
        low_y = max(open_y, close_y) + random.randint(5, 25)
        col = (34, 197, 94, 240) if close_y < open_y else (239, 68, 68, 220)
        draw.line([(bx + 6, high_y), (bx + 6, low_y)], fill=col, width=1)
        draw.rectangle([bx, min(open_y, close_y), bx + 12, max(open_y, close_y)], fill=col)

    # Balance pill
    draw.rounded_rectangle([cx - 160, cy - 130, cx + 160, cy - 70], radius=10, fill=(10, 20, 26, 240), outline=(34, 197, 94, 160), width=1)
    draw.text((cx - 140, cy - 120), "TOTAL TREASURY LIQUIDITY", fill=(140, 170, 160, 200))
    draw.text((cx - 140, cy - 95), "$14,280,450.00 USD  (+18.4%)", fill=(74, 222, 128, 255))

    draw_hud_frame(draw, "HyperFlow Global Treasury & FX", "Dashboards", "Multi-Currency Corporate Banking", (34, 197, 94), 340)
    img.save(os.path.join(OUTPUT_DIR, "hyperflow-fintech-cloud.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 17. Aegis Zero-Trust Cyber SOC
# ─────────────────────────────────────────────────────────────────────────────
def gen_aegis_cyber_defense_soc():
    img = create_base_canvas((2, 6, 12), (6, 20, 14), (74, 222, 128))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (74, 222, 128))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # 3D Threat Globe
    draw.ellipse([cx - 150, cy - 120, cx + 150, cy + 120], fill=(6, 12, 18, 255), outline=(74, 222, 128, 200), width=3)
    for r in [60, 110]:
        draw.ellipse([cx - r*1.3, cy - r, cx + r*1.3, cy + r], outline=(74, 222, 128, 60), width=1)

    # Attack Trajectory Arcs
    for ang1, ang2 in [(0.4, 2.2), (1.8, 3.8), (3.2, 5.5)]:
        x1, y1 = cx + 130 * math.cos(ang1), cy + 100 * math.sin(ang1)
        x2, y2 = cx + 130 * math.cos(ang2), cy + 100 * math.sin(ang2)
        draw.line([(x1, y1), (cx, cy - 40), (x2, y2)], fill=(239, 68, 68, 200), width=2)
        draw.ellipse([x2 - 5, y2 - 5, x2 + 5, y2 + 5], fill=(239, 68, 68, 255))

    # SOC Score Card
    draw.rounded_rectangle([cx - 120, cy + 80, cx + 120, cy + 130], radius=8, fill=(10, 18, 24, 230), outline=(74, 222, 128, 160), width=1)
    draw.text((cx - 105, cy + 95), "1.2M THREATS MITIGATED · MTTD <4.2s", fill=(74, 222, 128, 255))

    draw_hud_frame(draw, "Aegis Zero-Trust Cyber SOC", "Dashboards", "Security Operations Center", (74, 222, 128), 300)
    img.save(os.path.join(OUTPUT_DIR, "aegis-cyber-defense-soc.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 18. Halo Yield & Liquidity Protocol
# ─────────────────────────────────────────────────────────────────────────────
def gen_halo_stablecoin_protocol():
    img = create_base_canvas((4, 10, 16), (2, 22, 18), (52, 211, 153))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (52, 211, 153))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # 3D DeFi Token Ring
    draw.ellipse([cx - 140, cy - 80, cx + 140, cy + 80], outline=(52, 211, 153, 240), width=6)
    draw.ellipse([cx - 100, cy - 55, cx + 100, cy + 55], outline=(212, 175, 55, 220), width=4)
    draw.ellipse([cx - 50, cy - 25, cx + 50, cy + 25], fill=(8, 20, 24, 255), outline=(52, 211, 153, 180), width=2)

    # TVL & APY badge
    draw.rounded_rectangle([cx - 140, cy + 90, cx + 140, cy + 140], radius=8, fill=(8, 18, 22, 240), outline=(52, 211, 153, 160), width=1)
    draw.text((cx - 120, cy + 102), "TVL: $482M+  |  APY: 12.4% FIXED", fill=(52, 211, 153, 255))

    draw_hud_frame(draw, "Halo Yield & Liquidity Protocol", "Web3 & Crypto", "DeFi Staking & Institutional Yield", (52, 211, 153), 360)
    img.save(os.path.join(OUTPUT_DIR, "halo-stablecoin-protocol.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 19. Nexus ZK-Rollup Network
# ─────────────────────────────────────────────────────────────────────────────
def gen_nexus_layer2_rollup():
    img = create_base_canvas((3, 6, 12), (4, 18, 16), (110, 231, 183))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (110, 231, 183))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Layer-2 ZK Block Pipeline
    for i in range(5):
        bx = cx - 280 + i * 120
        draw.rounded_rectangle([bx, cy - 50, bx + 80, cy + 50], radius=8, fill=(10, 18, 26, 255), outline=(110, 231, 183, 220), width=2)
        draw.text((bx + 15, cy - 10), f"ZK-{i+1}", fill=(110, 231, 183, 255))
        if i < 4:
            draw.line([(bx + 80, cy), (bx + 120, cy)], fill=(110, 231, 183, 180), width=3)

    # 10,000 TPS speed indicator
    draw.rounded_rectangle([cx - 130, cy + 85, cx + 130, cy + 130], radius=6, fill=(8, 16, 22, 220), outline=(110, 231, 183, 160), width=1)
    draw.text((cx - 110, cy + 98), "10,000+ TPS · <$0.0004 GAS", fill=(110, 231, 183, 255))

    draw_hud_frame(draw, "Nexus ZK-Rollup Network", "Web3 & Crypto", "Zero-Knowledge Ethereum L2", (110, 231, 183), 340)
    img.save(os.path.join(OUTPUT_DIR, "nexus-layer2-rollup.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 20. Studio Kairo Spatial Brand Agency
# ─────────────────────────────────────────────────────────────────────────────
def gen_studio_kairo_spatial_agency():
    img = create_base_canvas((6, 12, 14), (8, 20, 16), (74, 222, 128))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (74, 222, 128))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Editorial 3D Frame Cards
    draw.rounded_rectangle([cx - 300, cy - 110, cx - 70, cy + 80], radius=10, fill=(16, 24, 28, 240), outline=(74, 222, 128, 160), width=2)
    draw.rounded_rectangle([cx - 40, cy - 130, cx + 190, cy + 60], radius=10, fill=(20, 28, 34, 255), outline=(74, 222, 128, 220), width=2)
    draw.rounded_rectangle([cx + 220, cy - 100, cx + 340, cy + 80], radius=10, fill=(14, 20, 24, 220), outline=(74, 222, 128, 120), width=1)

    draw.text((cx - 280, cy - 20), "SPATIAL\nEXPERIENCE", fill=(255, 255, 255, 240))
    draw.text((cx - 20, cy - 40), "AWWWARDS\n7x SOTD", fill=(74, 222, 128, 255))

    draw_hud_frame(draw, "Studio Kairo Spatial Brand Agency", "Creative Agency", "Awwwards Portfolio Atelier", (74, 222, 128), 400)
    img.save(os.path.join(OUTPUT_DIR, "studio-kairo-spatial-agency.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 21. Elysium Minimalist Design Lab
# ─────────────────────────────────────────────────────────────────────────────
def gen_elysium_minimalist_architects():
    img = create_base_canvas((4, 6, 8), (8, 14, 12), (167, 243, 208))
    draw = ImageDraw.Draw(img, "RGBA")

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Minimalist Swiss grid & hairline rules
    draw.line([(120, cy - 100), (WIDTH - 120, cy - 100)], fill=(167, 243, 208, 120), width=1)
    draw.line([(120, cy + 60), (WIDTH - 120, cy + 60)], fill=(167, 243, 208, 120), width=1)
    draw.line([(cx, cy - 140), (cx, cy + 100)], fill=(167, 243, 208, 80), width=1)

    draw.text((cx - 220, cy - 60), "ELYSIUM DESIGN LAB", fill=(255, 255, 255, 255))
    draw.text((cx - 220, cy - 30), "Monochrome Architecture & Industrial Systems", fill=(167, 243, 208, 200))
    draw.text((cx + 40, cy - 60), "100/100 LIGHTHOUSE", fill=(255, 255, 255, 240))
    draw.text((cx + 40, cy - 30), "Zero-Distraction Layout", fill=(167, 243, 208, 200))

    draw_hud_frame(draw, "Elysium Minimalist Design Lab", "Creative Agency", "Swiss Minimalist Portfolio", (167, 243, 208), 350)
    img.save(os.path.join(OUTPUT_DIR, "elysium-minimalist-architects.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 22. VisionOS Spatial Web Desktop
# ─────────────────────────────────────────────────────────────────────────────
def gen_visionos_glass_operating_system():
    img = create_base_canvas((4, 12, 20), (6, 26, 24), (134, 239, 172))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_dots_matrix(draw, (134, 239, 172))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Floating Glass Multi-Windows
    draw.rounded_rectangle([cx - 320, cy - 140, cx - 40, cy + 60], radius=16, fill=(15, 30, 40, 200), outline=(134, 239, 172, 160), width=2)
    draw.text((cx - 300, cy - 120), "3D Model Inspector", fill=(255, 255, 255, 255))

    draw.rounded_rectangle([cx, cy - 110, cx + 290, cy + 90], radius=16, fill=(20, 35, 45, 220), outline=(134, 239, 172, 220), width=2)
    draw.text((cx + 20, cy - 90), "Streaming Agent Studio", fill=(134, 239, 172, 255))

    # Bottom 3D Spatial Dock
    draw.rounded_rectangle([cx - 180, cy + 115, cx + 180, cy + 165], radius=24, fill=(10, 22, 30, 240), outline=(134, 239, 172, 180), width=2)
    for i in range(5):
        draw.ellipse([cx - 130 + i * 65, cy + 125, cx - 95 + i * 65, cy + 155], fill=(134, 239, 172, 200))

    draw_hud_frame(draw, "VisionOS Spatial Web Desktop", "Spatial OS", "Translucent Multi-Window WebXR OS", (134, 239, 172), 440)
    img.save(os.path.join(OUTPUT_DIR, "visionos-glass-operating-system.png"))


# ─────────────────────────────────────────────────────────────────────────────
# 23. Matrix Cyberpunk Neural Terminal
# ─────────────────────────────────────────────────────────────────────────────
def gen_matrix_cyber_terminal_os():
    img = create_base_canvas((2, 6, 2), (4, 18, 6), (34, 197, 94))
    draw = ImageDraw.Draw(img, "RGBA")

    # Falling digital rain matrix streams
    random.seed(999)
    for x in range(30, WIDTH - 30, 28):
        y_start = random.randint(30, 200)
        length = random.randint(8, 20)
        for i in range(length):
            alpha = int(255 * (i / length))
            draw.text((x, y_start + i * 22), chr(random.randint(65, 90)), fill=(34, 197, 94, alpha))

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    # Center CRT Bash Terminal
    draw.rounded_rectangle([cx - 280, cy - 110, cx + 280, cy + 80], radius=10, fill=(2, 8, 3, 240), outline=(34, 197, 94, 220), width=2)
    draw.text((cx - 255, cy - 90), "root@signhify-terminal:~# agent --swarm apex", fill=(74, 222, 128, 255))
    draw.text((cx - 255, cy - 60), "[+] Spawning 6 autonomous worker daemons...", fill=(34, 197, 94, 220))
    draw.text((cx - 255, cy - 35), "[+] Extracting 480 3D scroll canvas frames...", fill=(34, 197, 94, 220))
    draw.text((cx - 255, cy - 10), "[+] Production build: SUCCESS (0 errors)", fill=(134, 239, 172, 255))
    draw.text((cx - 255, cy + 25), "root@signhify-terminal:~# _", fill=(255, 255, 255, 255))

    draw_hud_frame(draw, "Matrix Cyberpunk Neural Terminal", "Spatial OS", "Retro CRT Digital Rain Shell", (34, 197, 94), 360)
    img.save(os.path.join(OUTPUT_DIR, "matrix-cyber-terminal-os.png"))


def main():
    print("Generating all 23 template and preset thumbnails...")
    gen_cyberpunk_kinetic_watch()
    gen_zenith_spatial_headset()
    gen_titanium_ev_supercar()
    gen_deep_sea_bioluminescence()
    gen_nova_ai_code-copilot() if False else gen_nova_ai_code_copilot()
    gen_apex_swarm_ai_orchestrator()
    gen_synthetix_voice_ai_canvas()
    gen_vectorflow_rag_pipeline()
    gen_orbital_quantum_compute()
    gen_hyperion_space_launch()
    gen_monolith_luxury_architecture()
    gen_vortex_wireless_audio()
    gen_lumina_holographic_display()
    gen_chronos_luxury_sneaker()
    gen_solaris_renewable_energy_grid()
    gen_hyperflow_fintech_cloud()
    gen_aegis_cyber_defense_soc()
    gen_halo_stablecoin_protocol()
    gen_nexus_layer2_rollup()
    gen_studio_kairo_spatial_agency()
    gen_elysium_minimalist_architects()
    gen_visionos_glass_operating_system()
    gen_matrix_cyber_terminal_os()
    print("All 23 thumbnails generated successfully in:", OUTPUT_DIR)

if __name__ == "__main__":
    main()
