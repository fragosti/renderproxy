import moment from 'moment';
import { TimeSeries } from 'pondjs';
import React, { useEffect, useState } from 'react';
import { BarChart, ChartContainer, ChartRow, Charts, Resizable, YAxis } from 'react-timeseries-charts';

import { UsageData } from '../types';
import { useAuth0 } from '../util/Auth0';

export interface UsageChartProps {
  domain: string;
}

const createTimeSeries = (usageData: UsageData): any => {
  return new TimeSeries({
    name: '30 Day Usage',
    utc: false,
    columns: ['index', 'requests'],
    points: Object.keys(usageData)
      .map(dateString => [dateString, usageData[dateString]])
      .reverse(),
  });
};

const style = {
  requests: {
    normal: { fill: '#A5C8E1' },
    highlighted: { fill: '#bfdff6' },
    selected: { fill: '#5aa2d5' },
    muted: { fill: '#A5C8E1', opacity: 0.4 },
  },
};

export const UsageChart: React.FC<UsageChartProps> = props => {
  const { api } = useAuth0();
  const [timeSeries, setTimeSeries] = useState();
  const [selection, setSelection] = useState();
  const [highlight, setHighlight] = useState();
  const [timeRange, setTimeRange] = useState();
  useEffect(() => {
    const getUsageData = async () => {
      const data = await api.getUsageAsync(props.domain);
      const series = createTimeSeries(data);
      setTimeRange(series.range());
      setTimeSeries(series);
    };
    getUsageData();
  }, []);
  if (!timeSeries) {
    return null;
  }
  const max = timeSeries.max('requests');
  let infoValues: any = [];
  if (highlight) {
    infoValues = [{ label: 'Requests', value: `${highlight.event.get('requests')}` }];
  }
  return (
    <Resizable>
      <ChartContainer
        utc={false}
        timeRange={timeRange}
        format="day"
        enablePanZoom={true}
        onTimeRangeChanged={setTimeRange}
        onBackgroundClick={() => setSelection(null)}
        maxTime={timeSeries.end()}
        minTime={timeSeries.begin()}
        minDuration={1000 * 60 * 60 * 24 * 5}
      >
        <ChartRow height="200">
          <YAxis id="requests" label="Requests" min={0} max={max} width="70" />
          <Charts>
            <BarChart
              axis="requests"
              style={style}
              columns={['requests']}
              series={timeSeries}
              info={infoValues}
              infoTimeFormat={(index: any) => moment(index.begin()).format(`Do MMM 'YY`)}
              highlighted={highlight}
              onHighlightChange={setHighlight}
              selected={selection}
              onSelectionChange={setSelection}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
};
