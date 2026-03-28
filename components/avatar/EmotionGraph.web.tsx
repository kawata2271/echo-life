import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'

interface Props {
  data: number[] // 7 values (0-100)
}

const GRAPH_WIDTH = 300
const GRAPH_HEIGHT = 150

export function EmotionGraph({ data }: Props) {
  const avg = data.reduce((a, b) => a + b, 0) / data.length
  const accentColor = avg > 65 ? TOKENS.color.sage : avg > 40 ? TOKENS.color.amber : TOKENS.color.terra

  return (
    <View style={styles.container}>
      <Typography variant="mono" color={TOKENS.color.textMuted} style={styles.title}>
        週次幸福度
      </Typography>
      <View style={[styles.graph, { width: GRAPH_WIDTH, height: GRAPH_HEIGHT }]}>
        {/* SVG graph rendered via web inline SVG */}
        <svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}>
          {/* Grid lines */}
          {[25, 50, 75].map((v, i) => {
            const y = 20 + ((100 - v) / 100) * (GRAPH_HEIGHT - 40)
            return (
              <line
                key={i}
                x1={20} y1={y} x2={GRAPH_WIDTH - 20} y2={y}
                stroke={TOKENS.color.border}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )
          })}
          {/* Area fill */}
          <polygon
            points={
              data.map((v, i) => {
                const x = 20 + (i / (data.length - 1)) * (GRAPH_WIDTH - 40)
                const y = 20 + ((100 - v) / 100) * (GRAPH_HEIGHT - 40)
                return `${x},${y}`
              }).join(' ') +
              ` ${GRAPH_WIDTH - 20},${GRAPH_HEIGHT - 20} 20,${GRAPH_HEIGHT - 20}`
            }
            fill={accentColor}
            fillOpacity={0.2}
          />
          {/* Line */}
          <polyline
            points={data.map((v, i) => {
              const x = 20 + (i / (data.length - 1)) * (GRAPH_WIDTH - 40)
              const y = 20 + ((100 - v) / 100) * (GRAPH_HEIGHT - 40)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
          />
          {/* Dots */}
          {data.map((v, i) => {
            const x = 20 + (i / (data.length - 1)) * (GRAPH_WIDTH - 40)
            const y = 20 + ((100 - v) / 100) * (GRAPH_HEIGHT - 40)
            return <circle key={i} cx={x} cy={y} r={3} fill={accentColor} />
          })}
        </svg>
      </View>
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
  graph: {
    overflow: 'hidden',
  },
})
