import styles from "@/styles/loadingdots.module.css";

const LoadingDots = () => {
  return (
    <div role="status" className="grid-cols-3">
      <div className={styles.dot} />
    </div>
  );
};

export default LoadingDots;
