import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Canvas, Path, LinearGradient, vec, DashPathEffect, Line } from '@shopify/react-native-skia'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'

interface Props {
  data: number[] // 7 values (0-100)
}

const GRAPH_WIDTH = 300
const GRAPH_HEIGHT = 150
const PADDING = 20

function catmullRomToPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

export function EmotionGraph({ data }: Props) {
  const avg = data.reduce((a, b) => a + b, 0) / data.length
  const accentColor = avg > 65 ? TOKENS.color.sage : avg > 40 ? TOKENS.color.amber : TOKENS.color.terra

  const points = data.map((v, i) => ({
    x: PADDING + (i / (data.length - 1)) * (GRAPH_WIDTH - PADDING * 2),
    y: PADDING + ((100 - v) / 100) * (GRAPH_HEIGHT - PADDING * 2),
  }))

  const curvePath = catmullRomToPath(points)

  // Create fill path (curve + bottom rectangle)
  const fillPath = curvePath +
    ` L ${points[points.length - 1].x} ${GRAPH_HEIGHT - PADDING}` +
    ` L ${points[0].x} ${GRAPH_HEIGHT - PADDING} Z`

  const gridYs = [25, 50, 75].map(
    (v) => PADDING + ((100 - v) / 100) * (GRAPH_HEIGHT - PADDING * 2)
  )

  return (
    <View style={styles.container}>
      <Typography variant="mono" color={TOKENS.color.textMuted} style={styles.title}>
        週次幸福度
      </Typography>
      <Canvas style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}>
        {/* Grid lines */}
        {gridYs.map((y, i) => (
          <Line
            key={i}
            p1={vec(PADDING, y)}
            p2={vec(GRAPH_WIDTH - PADDING, y)}
            color={TOKENS.color.border}
            strokeWidth={1}
          >
            <DashPathEffect intervals={[4, 4]} />
          </Line>
        ))}
        {/* Fill */}
        <Path path={fillPath} style="fill">
          <LinearGradient
            start={vec(0, PADDING)}
            end={vec(0, GRAPH_HEIGHT - PADDING)}
            colors={[accentColor + '60', accentColor + '00']}
          />
        </Path>
        {/* Curve */}
        <Path
          path={curvePath}
          style="stroke"
          strokeWidth={2}
          color={accentColor}
        />
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: TOKENS.spacing.md,
  },
  title: {
    marginBottom: TOKENS.spacing.sm,
  },
})
