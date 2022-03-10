import React, { useState } from "react";
import { getHeroDetail } from "./api";
import "./tailwind.output.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await getHeroDetail(text);
    setData(response);
    setLoading(false);
  };
  return (
    <div className="max-w-xl mx-auto">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="hero-name"
      >
        Search
      </label>

      <div>
        <input
          className="shadow appearance-none border rounded py-2 px-2"
          id="hero-name"
          placeholder="Type hero name"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="inline-flex rounded bg-blue-600 hover:bg-blue-500 font-bold text-white py-2 px-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {loading && <div>loading</div>}
      {data && (
        <div>
          <img src={data.avatar} alt={`Avatar of ${data.name}`} />
          <div>
            <div>{data.name}</div>
            <div>{data.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
