import { useEffect } from "react";

import drawContributionGraph from "github-contribution-graph";

const ContributionGraph = () => {
  useEffect(() => {
    // Sample data for the contribution graph
    const data = {
      2021: [
        {
          done: 15,
          not_done: 0,
          date: "2021-02-08",
        },
        {
          done: 10,
          not_done: 1,
          date: "2021-01-08",
        },
        {
          done: 15,
          not_done: 4,
          date: "2021-05-12",
        },
      ],
      2022: [
        {
          done: 3,
          not_done: 0,
          date: "2022-04-05",
        },
        {
          done: 5,
          not_done: 1,
          date: "2022-01-05",
        },
        {
          done: 2,
          not_done: 1,
          date: "2022-07-13",
        },
      ],
      2023: [
        {
          done: 10,
          not_done: 2,
          date: "2023-03-02",
        },
        {
          done: 3,
          not_done: 1,
          date: "2023-06-01",
        },
        {
          done: 2,
          not_done: 0,
          date: "2023-03-01",
        },
        {
          done: 2,
          not_done: 1,
          date: "2023-02-28",
        },
        {
          done: 5,
          not_done: 0,
          date: "2023-02-25",
        },
      ],
    };

    // Draw the contribution graph when the component mounts
    drawContributionGraph({
      data,
      config: {
        graphMountElement: "#contribution-graph",
      },
    });
  }, []);

  return (
    <div className="relative w-full h-auto p-4 bg-core-light rounded-xl shadow-lg">
      <div id="contribution-graph" className="w-full overflow-x-auto"></div>
    </div>
  );
};

export default ContributionGraph;
