import { useRef, useEffect } from "react";

import { Detail } from "components";
import { useGlobalData } from "hooks/useGlobalData";

import { selectedDataUpdater } from "../VerticalClusterList.util";

import "./Summary.scss";
import type { Cluster } from "./Summary.type";
import { Author } from "./Author";
import { Content } from "./Content";
import { getClusterById, getClusterIds, getInitData } from "./Summary.util";

const Summary = () => {
  const { filteredData: data, selectedData, setSelectedData } = useGlobalData();
  const ref = useRef<HTMLDivElement>(null);
  const clusters = getInitData({ data });
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedClusterId = getClusterIds(selectedData);
  const onClickClusterSummary = (clusterId: number) => {
    if (!setSelectedData) return;
    const selected = getClusterById(data, clusterId);
    setSelectedData(selectedDataUpdater(selected, clusterId) as any);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [selectedData]);

  return (
    <div className="cluster-summary__container">
      {clusters.map((cluster: Cluster) => {
        return (
          <div
            role="presentation"
            className="cluster-summary__cluster"
            key={cluster.clusterId}
          >
            <button
              type="button"
              className="cluster-summary__toggle-contents-button"
              onClick={() => onClickClusterSummary(cluster.clusterId)}
            >
              <div className="cluster-summary__toggle-contents-container">
                <div className="name-box">
                  {cluster.summary.authorNames.map(
                    (authorArray: Array<string>) => {
                      return authorArray.map((authorName: string) => (
                        <Author key={authorName} name={authorName} />
                      ));
                    }
                  )}
                </div>
                <Content
                  content={cluster.summary.content}
                  clusterId={cluster.clusterId}
                  selectedClusterId={selectedClusterId}
                />
              </div>
            </button>
            {cluster.clusterId === selectedClusterId && (
              <div
                className="cluster-summary__detail__container"
                ref={scrollRef}
              >
                <div ref={ref}>
                  <div className="summary-detail__wrapper">
                    <Detail selectedData={selectedData ?? null} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
