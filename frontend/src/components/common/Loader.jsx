function Loader({ label = "Loading dashboard..." }) {
  return (
    <div className="loader-wrap">
      <div className="loader" />
      <p>{label}</p>
    </div>
  );
}

export default Loader;
