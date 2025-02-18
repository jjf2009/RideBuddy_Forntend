const Help = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-3xl font-bold text-center mb-4">Why Carpool with RideBuddy?</h2>
      <div className="collapse collapse-plus bg-base-200">
        <input type="radio" name="help-accordion" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          🚀 Only for Goa College Students
        </div>
        <div className="collapse-content">
          <p>RideBuddy is exclusively for students studying in Goa colleges, ensuring safety and community-driven rides.</p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-base-200">
        <input type="radio" name="help-accordion" />
        <div className="collapse-title text-xl font-medium">
          💰 Save Money
        </div>
        <div className="collapse-content">
          <p>Reduce travel costs by sharing rides with fellow students heading in the same direction.</p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-base-200">
        <input type="radio" name="help-accordion" />
        <div className="collapse-title text-xl font-medium">
          🌱 Eco-Friendly
        </div>
        <div className="collapse-content">
          <p>Lower your carbon footprint by reducing the number of vehicles on the road.</p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-base-200">
        <input type="radio" name="help-accordion" />
        <div className="collapse-title text-xl font-medium">
          🤝 Build Connections
        </div>
        <div className="collapse-content">
          <p>Meet new people, network with students from different colleges, and travel together.</p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-base-200">
        <input type="radio" name="help-accordion" />
        <div className="collapse-title text-xl font-medium">
          ⏳ Save Time
        </div>
        <div className="collapse-content">
          <p>Avoid waiting for public transport and travel at your convenience.</p>
        </div>
      </div>
    </div>
  );
};


export default Help;