export const CarCard = () => {
  return (
    <div className="card" style={{ width: "15rem" }}>
      <img
        src="https://i.pinimg.com/736x/03/f0/64/03f0641966e2aace6b249053ebba0ed5.jpg"
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title">Ferrari 488 GTB</h5>

        <div className="d-flex flex-column ">
          <div>
            <p className="badge bg-info py-2 px-3">Coupe</p>
          </div>

          <p className="card-text">Rp 5.000.000 / day</p>

          <button className="btn btn-success">Rent</button>
        </div>
      </div>
    </div>
  );
};
