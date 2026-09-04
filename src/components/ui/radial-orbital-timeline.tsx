"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  academy?: string;
  link?: string;
  category: string;
  iconName: string;
  status: "completed" | "in-progress" | "pending";
  energy: number;
  relatedIds?: number[];
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  profileImage?: string;
  rotationSpeed?: number;
}

// Profile image radius in px (w-64 = 256px / 2 = 128px)
// Profile container = 220px diameter → actual photo (inset-[5px]) = 210px, radius ≈ 105px
const PROFILE_CONTAINER = 220;  // px — set on the div
const PROFILE_RADIUS = 105;     // px — edge of the visible photo from centre
// Gap between photo edge and orbit ring centre: ~80px ≈ 2.1cm @ 96dpi (within 1.5–2cm range)
const ORBIT_GAP = 80;
// Orbit radius (centre of dashed ring from centre of whole component)
const ORBIT_RADIUS = PROFILE_RADIUS + ORBIT_GAP; // 185px → orbit diameter 370px
// Node size
const NODE_SIZE = 44; // px — slightly smaller nodes for elegance

export default function RadialOrbitalTimeline({
  timelineData,
  profileImage,
  rotationSpeed = 5,
}: RadialOrbitalTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ─── Auto-rotation ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!autoRotate) return;
    const speed = Math.max(1, parseFloat(rotationSpeed?.toString() || "5"));
    // degrees per 50ms interval so one full rotation = speed seconds
    const degPerTick = 360 / ((speed * 1000) / 50);
    const id = setInterval(() => {
      setRotationAngle((a) => (a + degPerTick) % 360);
    }, 50);
    return () => clearInterval(id);
  }, [autoRotate, rotationSpeed]);

  /* ─── Helpers ────────────────────────────────────────────────────── */
  const getStatusStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":   return "text-emerald-400 bg-emerald-950/30 border-emerald-500/50";
      case "in-progress": return "text-cyan-400 bg-cyan-950/30 border-cyan-500/50";
      case "pending":     return "text-gray-400 bg-white/5 border-white/10";
      default:            return "text-white bg-black/40 border-white/50";
    }
  };

  const getStatusColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":   return "#10b981";
      case "in-progress": return "#22d3ee";
      case "pending":     return "#6b7280";
      default:            return "#a855f7";
    }
  };

  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Circle;
    return <Icon size={18} />;
  };

  /* ─── Node position (on the orbit circle only) ───────────────────── */
  // Each node sits exactly on ORBIT_RADIUS from center.
  // Transform: translate from center then subtract half node size to center it.
  const nodePosition = (index: number, total: number) => {
    const angleDeg = (index / total) * 360 + rotationAngle;
    const rad = (angleDeg * Math.PI) / 180;
    const x = ORBIT_RADIUS * Math.cos(rad); // from center
    const y = ORBIT_RADIUS * Math.sin(rad);
    return { x, y, rad };
  };

  const orbitDiameter = ORBIT_RADIUS * 2; // 370px
  const containerSize = orbitDiameter + 300; // 670px
  const centerPos = containerSize / 2; // 335px

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
      onClick={() => {
        setExpandedId(null);
        setAutoRotate(true);
      }}
    >
      {/* ── Outer wrapper: fixed-size container centred on screen ── */}
      <div
        className="relative"
        style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
      >
        {/* ── Orbit ring (fixed, not rotating) ── */}
        <div
          className="absolute rounded-full border border-dashed border-white/25 pointer-events-none"
          style={{ 
            width: orbitDiameter, height: orbitDiameter,
            top: `${centerPos - ORBIT_RADIUS}px`, 
            left: `${centerPos - ORBIT_RADIUS}px`
          }}
        />

        {/* ── Inner glow ring ── */}
        <div
          className="absolute rounded-full border border-neon-purple/10 pointer-events-none"
          style={{ 
            width: orbitDiameter + 40, height: orbitDiameter + 40,
            top: `${centerPos - ORBIT_RADIUS - 20}px`, 
            left: `${centerPos - ORBIT_RADIUS - 20}px`
          }}
        />

        {/* ── Profile image (fixed at centre) ── */}
        <div
          className="absolute rounded-full z-10"
          style={{ 
            width: PROFILE_CONTAINER, height: PROFILE_CONTAINER,
            top: `${centerPos - PROFILE_CONTAINER / 2}px`, 
            left: `${centerPos - PROFILE_CONTAINER / 2}px`
          }}
        >
          {/* Pulsing border gradient */}
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: "conic-gradient(from 0deg, #a855f7, #22d3ee, #ec4899, #a855f7)",
              padding: 3,
            }}
          >
            <div className="w-full h-full rounded-full bg-dark-main" />
          </div>

          {/* Ping rings */}
          <div className="absolute inset-0 rounded-full border border-neon-purple/20 animate-ping opacity-60" />
          <div
            className="absolute inset-0 rounded-full border border-neon-cyan/10 animate-ping opacity-40"
            style={{ animationDelay: "0.7s" }}
          />

          {/* Photo */}
          <div className="absolute inset-[5px] rounded-full overflow-hidden z-20 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <Image
              src={profileImage || "/profile.jpg"}
              alt="Profile"
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        </div>

        {/* ── Orbiting nodes ── */}
        {timelineData.map((item, index) => {
          const { x, y, rad } = nodePosition(index, timelineData.length);
          const isExpanded = expandedId === item.id;
          const statusColor = getStatusColor(item.status);

          // Card offset: push outward from node position along the same angle
          const cardPushDist = 170; // px from node centre
          const cardX = Math.cos(rad) * cardPushDist;
          const cardY = Math.sin(rad) * cardPushDist;

          // Label offset: small push outward from node
          const labelPushDist = 40;
          const labelX = Math.cos(rad) * labelPushDist;
          const labelY = Math.sin(rad) * labelPushDist;

          return (
            <div
              key={item.id}
              className="absolute transition-transform duration-700"
              style={{
                top: `${centerPos + y - NODE_SIZE / 2}px`,
                left: `${centerPos + x - NODE_SIZE / 2}px`,
                width: NODE_SIZE,
                height: NODE_SIZE,
                zIndex: isExpanded ? 50 : 20,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isExpanded) {
                  setExpandedId(null);
                  setAutoRotate(true);
                } else {
                  setExpandedId(item.id);
                  setAutoRotate(false);
                }
              }}
            >
              {/* Energy glow halo */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: `-${(item.energy * 0.3) / 2}px`,
                  background: `radial-gradient(circle, ${statusColor}33 0%, transparent 70%)`,
                }}
              />

              {/* Node button */}
              <div
                className="w-full h-full rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-300"
                style={{
                  backgroundColor: isExpanded ? statusColor + "33" : "rgba(8,8,20,0.92)",
                  borderColor: isExpanded ? statusColor : "rgba(255,255,255,0.15)",
                  color: isExpanded ? statusColor : "#ffffff",
                  boxShadow: isExpanded ? `0 0 20px ${statusColor}66` : "none",
                  transform: isExpanded ? "scale(1.2)" : "scale(1)",
                }}
              >
                {renderIcon(item.iconName)}
              </div>

              {/* Title label — pushes outward along radius, never overlaps centre */}
              <div
                className="absolute whitespace-nowrap text-[10px] font-mono tracking-widest uppercase pointer-events-none select-none transition-all duration-300"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${labelX}px), calc(-50% + ${labelY}px))`,
                  color: isExpanded ? statusColor : "#9ca3af",
                  fontWeight: isExpanded ? 700 : 400,
                  textShadow: isExpanded ? `0 0 8px ${statusColor}` : "none",
                }}
              >
                {item.title}
              </div>

              {/* Info card — rendered when expanded, pushed outward */}
              {isExpanded && (
                <Card
                  className="absolute bg-[#08080f]/95 backdrop-blur-xl border-[rgba(255,255,255,0.12)] shadow-[0_8px_40px_rgba(0,0,0,0.6)] w-72 overflow-visible z-50 cursor-default"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${cardX}px), calc(-50% + ${cardY}px))`,
                    borderColor: statusColor + "44",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardHeader className="pb-3 border-b border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        className={`font-mono text-[10px] tracking-widest ${getStatusStyles(item.status)}`}
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-mono text-gray-400">{item.date}</span>
                    </div>
                    <CardTitle className="text-base font-display text-white">
                      {item.title}
                    </CardTitle>
                    {item.academy && (
                      <div className="text-xs font-mono mt-1 flex items-center gap-1.5" style={{ color: statusColor }}>
                        <LucideIcons.GraduationCap size={11} />
                        {item.academy}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 text-sm text-gray-300 leading-relaxed font-mono">
                    <p>{item.content}</p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/20 border border-cyan-500/20 px-3 py-2 rounded-lg w-fit"
                      >
                        <ExternalLink size={12} />
                        Verify Credential
                      </a>
                    )}

                    <div className="mt-5 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="flex items-center text-gray-400">
                          <Zap size={12} className="mr-1.5 text-yellow-500" />
                          Proficiency
                        </span>
                        <span className="font-mono text-white">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full shadow-[0_0_8px_currentColor]"
                          style={{
                            width: `${item.energy}%`,
                            background: `linear-gradient(90deg, ${statusColor}, #22d3ee)`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
