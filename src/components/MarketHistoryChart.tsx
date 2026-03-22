import { useEffect, useRef } from "react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type UTCTimestamp,
} from "lightweight-charts";
import type { MarketHistoryPoint } from "@/api/market";

type MarketHistoryChartProps = {
  points: MarketHistoryPoint[];
};

export default function MarketHistoryChart({
  points,
}: MarketHistoryChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const yesSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const noSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container) {
      return;
    }

    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue("--text-strong").trim();
    const gridLine = styles.getPropertyValue("--grid-line").trim();
    const borderColor = styles.getPropertyValue("--border-soft").trim();
    const yesColor = styles.getPropertyValue("--color-primary").trim();
    const noColor = styles.getPropertyValue("--color-secondary").trim();
    const surfaceColor = styles.getPropertyValue("--surface-soft").trim();
    const surfaceStrong = styles.getPropertyValue("--surface-strong").trim();
    const fontBody = styles.getPropertyValue("--font-body").trim();

    const chart = createChart(container, {
      autoSize: true,
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: borderColor,
          labelVisible: false,
          style: LineStyle.Dotted,
          visible: true,
        },
        horzLine: {
          color: borderColor,
          labelVisible: false,
          style: LineStyle.Dotted,
          visible: true,
        },
      },
      grid: {
        horzLines: {
          color: gridLine,
          style: LineStyle.Dotted,
          visible: true,
        },
        vertLines: {
          color: gridLine,
          style: LineStyle.Dotted,
          visible: true,
        },
      },
      height: container.clientHeight || 416,
      layout: {
        attributionLogo: false,
        background: {
          bottomColor: surfaceColor,
          topColor: surfaceStrong,
          type: ColorType.VerticalGradient,
        },
        fontFamily: fontBody,
        textColor,
      },
      localization: {
        locale: "en-US",
        priceFormatter: (value: number) => `${value.toFixed(1)}%`,
      },
      rightPriceScale: {
        autoScale: true,
        borderColor,
        minimumWidth: 64,
        scaleMargins: {
          bottom: 0.08,
          top: 0.08,
        },
        ticksVisible: true,
      },
      timeScale: {
        borderColor,
        rightOffset: 8,
        timeVisible: true,
        ticksVisible: true,
      },
    });

    const fixedRangeProvider = () => ({
      priceRange: {
        maxValue: 100,
        minValue: 0,
      },
    });

    const yesSeries = chart.addSeries(LineSeries, {
      autoscaleInfoProvider: fixedRangeProvider,
      color: yesColor,
      crosshairMarkerBackgroundColor: yesColor,
      crosshairMarkerBorderColor: surfaceStrong,
      crosshairMarkerBorderWidth: 2,
      crosshairMarkerRadius: 5,
      lineWidth: 3,
      priceFormat: {
        minMove: 0.1,
        precision: 1,
        type: "price",
      },
      priceLineVisible: false,
      title: "YES",
    });

    const noSeries = chart.addSeries(LineSeries, {
      autoscaleInfoProvider: fixedRangeProvider,
      color: noColor,
      crosshairMarkerBackgroundColor: noColor,
      crosshairMarkerBorderColor: surfaceStrong,
      crosshairMarkerBorderWidth: 2,
      crosshairMarkerRadius: 5,
      lineStyle: LineStyle.Dashed,
      lineWidth: 3,
      priceFormat: {
        minMove: 0.1,
        precision: 1,
        type: "price",
      },
      priceLineVisible: false,
      title: "NO",
    });

    chartRef.current = chart;
    yesSeriesRef.current = yesSeries;
    noSeriesRef.current = noSeries;

    const resizeObserver = new ResizeObserver(() => {
      if (!chartRef.current || !chartContainerRef.current) {
        return;
      }

      chartRef.current.applyOptions({
        height: chartContainerRef.current.clientHeight,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      yesSeriesRef.current = null;
      noSeriesRef.current = null;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!yesSeriesRef.current || !noSeriesRef.current || !chartRef.current) {
      return;
    }

    const { noData, yesData } = toChartData(points);

    yesSeriesRef.current.setData(yesData);
    noSeriesRef.current.setData(noData);

    chartRef.current.timeScale().fitContent();
  }, [points]);

  return <div className="market-history-chart" ref={chartContainerRef} />;
}

function toChartData(points: MarketHistoryPoint[]) {
  const orderedPoints = [...points].sort(
    (left, right) =>
      new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
  const yesPointMap = new Map<number, number>();
  const noPointMap = new Map<number, number>();

  orderedPoints.forEach((point) => {
    const time = toUtcTimestamp(point.timestamp);
    yesPointMap.set(time, roundPercentage(point.yesProbability * 100));
    noPointMap.set(time, roundPercentage(point.noProbability * 100));
  });

  return {
    noData: Array.from(noPointMap.entries()).map(([time, value]) => ({
      time: time as UTCTimestamp,
      value,
    })) satisfies LineData[],
    yesData: Array.from(yesPointMap.entries()).map(([time, value]) => ({
      time: time as UTCTimestamp,
      value,
    })) satisfies LineData[],
  };
}

function toUtcTimestamp(timestamp: string) {
  return Math.floor(new Date(timestamp).getTime() / 1000) as UTCTimestamp;
}

function roundPercentage(value: number) {
  return Math.round(value * 10) / 10;
}
