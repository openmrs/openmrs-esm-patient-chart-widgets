import { useRouteMatch } from "react-router-dom";
export default function useChartBasePath() {
  const match = useRouteMatch();
  const chartBasePath = `${match.url.substr(
    0,
    match.url.search("/chart/")
  )}/chart`;
  return [chartBasePath];
}
