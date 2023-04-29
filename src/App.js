import "./styles.css";
import { useEffect, useState } from "react";
export default function App() {
  let options = ["All", "Any", "Race", "AllSettles", "Finally"];
  const [initialData, setInitiialData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const getData = async () => {
    let url = "https://pokeapi.co/api/v2/pokemon";
    let response = await fetch(url);
    let data = await response.json();
    setInitiialData(data.results);
  };

  useEffect(() => {
    getData();
  }, []);
  function promisAllFunc(promiseArray) {
    Promise.all(promiseArray).then((responses) => {
      // array of reposnes

      Promise.all(
        // resonse.json() returns a promise, thus we will get array of promise again
        responses.map((res) => res.json())
      ).then((final) => {
        setTableData(final);
      });
    });
  }

  function promiseAnyFunc(promiseArray) {
    Promise.any(promiseArray).then(async (response) => {
      // this will give  1 single promise, response

      // response.json() is a promise itself
      let data = await response.json();
      setTableData([data]);
    });
  }

  function promiseRaceFunc(promiseArray) {
    Promise.race(promiseArray).then(async (responseRace) => {
      responseRace.json().then((data) => {
        setTableData([data]);
      });
    });
  }
  const getArrayPromises = () => {
    let promiseArray = [];

    initialData.forEach((obj) => {
      promiseArray.push(fetch(obj.url));
    });
    return promiseArray;
  };
  const changeOption = (e) => {
    let promiseArray = getArrayPromises();
    let option = e.target.value;
    console.log("changeOption", option);
    switch (option) {
      case "All":
        promisAllFunc(promiseArray);
      /* 
      following lines are commented because same promise is called multiple times
      case "Any":
        promiseAnyFunc(promiseArray);

        case "Race":
        promiseRaceFunc(promiseArray);
        */

      default:
        return [];
    }
  };

  return (
    <div className="App">
      <h1>Fetch Pokemon with promises</h1>
      <select
        onChange={(e) => {
          changeOption(e);
        }}
      >
        {" "}
        <option value="">Choose here</option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>

      {tableData.length > 0 && (
        <div className="result">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Height</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((obj) => {
                return (
                  <tr key={obj.id}>
                    <td>{obj.name}</td>
                    <td>{obj.weight}</td>
                    <td>{obj.height}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
