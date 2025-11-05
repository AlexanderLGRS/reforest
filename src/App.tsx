import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tableData, setTableData] = useState([
    { name: "initialFruits", titleComplete: "Frutos iniciales", title: "F. iniciales", values: [8, 10, 12, 14, 9, 11] },
    { name: "fruitsEated", titleComplete: "Frutos comidos", title: "F. comidos", values: [6, 6, 2, 1, 3, 1] },
    { name: "seedsPerFruit", titleComplete: "Semillas por fruto", title: "S x F", values: [7, 4, 9, 10, 7, 8] },
    { name: "percentageSeedsPerMouse", titleComplete: "Semillas comidas por ratón", title: "S. Raton", values: [80, 50, 30, 50, 40, 20] },
    { name: "percentageSeedsGerminate", titleComplete: "Semillas que germinan", title: "S. Germinan", values: [20, 60, 20, 50, 20, 90] },
    { name: "percentageSeedsSurvive", titleComplete: "Plantulas que sobreviven", title: "Plantulas S", values: [60, 60, 50, 40, 10, 80] }
  ])
  const [reorderedTable, setReorderedTable]: any = useState([])
  interface tryData {
    initialFruits: number
    frutosFinales: number
    fruitsEated: number
    seedsPerFruit: number
    semillasIniciales: number
    percentageSeedsPerMouse: number
    percentageSeedsGerminate: number
    percentageSeedsSurvive: number
    semillasDespuesDeRaton: number
    seedsPerMouse: number
    seedsGerminate: number
    seedsSurvive: number
  }
  const [userData, setUserData] = useState("")
  const [dataIngresed, setDataIngresed] = useState(false)
  const [triesData, setTriesData] = useState<tryData[]>([])
  const [generated, setGenerated] = useState<boolean>(false)
  const [triesQuantity, setTriesQuantity] = useState<number>(1)
  const [finalData, setFinalData] = useState({
    promedio: "",
    varianza: "",
    desviacionEstandar: "",
    errorEstandar: "",
    range: ["", ""],

  })

  const reorderData = (): any => {
    let reorderedData: any = []
    for (let i = 0; i < tableData.length; i++) {
      let reorderedRow: any = []
      for (let j = 0; j < tableData.length; j++) {
        reorderedRow.push(tableData[j].values[i])
      }
      reorderedData.push(reorderedRow)
    }
    setReorderedTable(reorderedData)
  }

  let triesDataBatch: tryData[] = []
  const handleMakeTry = () => {
    let tryData: any = {}
    tableData.forEach(element => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      tryData[element.name] = element.values[randomNumber - 1]
    });
    setGenerated(true)
    triesDataBatch.push(handleTryData(tryData))
  }
  const handleTryData = (tryData: tryData) => {
    tryData.frutosFinales = Math.round(tryData.initialFruits - tryData.fruitsEated)
    if (tryData.frutosFinales <= 0) {
      tryData.semillasIniciales = 0
      tryData.seedsPerMouse = 0
      tryData.semillasDespuesDeRaton = 0
      tryData.seedsGerminate = 0
      tryData.seedsSurvive = 0
    } else {
      tryData.semillasIniciales = Math.round(tryData.frutosFinales * tryData.seedsPerFruit)
      tryData.seedsPerMouse = Math.round((tryData.semillasIniciales * tryData.percentageSeedsPerMouse) / 100)
      tryData.semillasDespuesDeRaton = Math.round(tryData.semillasIniciales - tryData.seedsPerMouse)
      tryData.seedsGerminate = Math.round((tryData.semillasDespuesDeRaton * tryData.percentageSeedsGerminate) / 100)
      tryData.seedsSurvive = Math.round((tryData.seedsGerminate * tryData.percentageSeedsSurvive) / 100)
    }
    return tryData
  }

  const handleMakeTriesQuantity = () => {
    for (let i = 0; i < triesQuantity; i++) {
      handleMakeTry()
    }
    setTriesData(triesDataBatch)
    determinateRange()
  }
  const determinateRange = () => {
    let tryFinalValues: number[] = []
    triesDataBatch.forEach(element => {
      tryFinalValues.push(element.seedsSurvive)
    });
    let promedio = (tryFinalValues.reduce((a, b) => a + b) / tryFinalValues.length)
    let varianza = 0
    tryFinalValues.forEach(element => {
      varianza += (promedio - element) ** 2
    });
    varianza = varianza / tryFinalValues.length
    const desviacionEstandar = Math.sqrt(varianza)
    const errorEstandar = desviacionEstandar / Math.sqrt(tryFinalValues.length)
    const range = [(promedio - errorEstandar).toFixed(2), (promedio + errorEstandar).toFixed(2)]

    setFinalData({
      promedio: promedio.toFixed(2),
      varianza: varianza.toFixed(2),
      desviacionEstandar: desviacionEstandar.toFixed(2),
      errorEstandar: errorEstandar.toFixed(2),
      range: range
    });

  }

  const handleSubmitForm = (event: any) => {
    event.preventDefault()
    let temp: any = [...tableData]
    const formData = new FormData(event.target);
    tableData.forEach((element, index) => {
      let finalColumnData: any = []
      let columnData: any = formData.get(`${element.name}`)
      columnData = columnData?.toString().split(",")
      columnData = columnData?.forEach((element: any) => {
        finalColumnData.push(parseInt(element))
      });
      temp[index].values = finalColumnData
    });
    setDataIngresed(true)
    setTableData(temp)
    reorderData()

  }

  return (
    <>
      <h2>Reforestación de un bosque despues de un incendio</h2>
      <div className="header-container">

        <h3>Continuar con:</h3>
        <input type="radio" id='haveDataSI' name='haveData' value={"SI"} onChange={({ target }) => setUserData(target.value)} />
        <label htmlFor="haveDataSI">Datos propios</label>
        <br />
        <input type="radio" id='haveDataNO' name='haveData' value={"NO"} onChange={({ target }) => {
          setUserData(target.value);
          setDataIngresed(false)
          reorderData()
        }} />
        <label htmlFor="haveDataNO">Datos de prueba</label>
      </div>
      {
        userData === "SI"
          ? <>        
            <form onSubmit={handleSubmitForm}>
            <h3>Digite los datos para alimentar una tabla 6 x 6, separe los valores con comas</h3>
              {tableData.map((field, index) => (
                <div key={index} className='form-field'>
                  <label htmlFor="">{field.titleComplete}</label>
                  <input required name={field.name} placeholder={`Ingrese sus datos separados por comas`} className="inputUserData" type="text" />
                </div>
              ))}
              <button type='submit'>Registrar datos</button>
            </form>
          </>
          : userData === "NO" &&
          <div className="table-container">
            <h3>Tabla de datos</h3>
            <table>
              <thead>
                <tr>
                  {tableData.map((element) => (
                    <td key={element.title}>{element.title}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reorderedTable.map((element: any, index: number) =>
                  <tr key={`${Math.random(), element, index}`}>
                    {element.map((value: any) => (
                      <td key={Math.random() + index + element}>{value}</td>
                    ))}
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
      }
      {dataIngresed &&
        <div className="table-container">
          <h3>Tabla de datos</h3>
          <table>
            <thead>
              <tr>
                {tableData.map((element, index) => (
                  <td key={element.title + index}>{element.title}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {reorderedTable.map((element: any, index: number) =>
                <tr key={`${Math.random(), element, index}`}>
                  {element.map((value: any) => (
                    <td key={Math.random() + index + element}>{value}</td>
                  ))}
                </tr>
              )
              }
            </tbody>
          </table>
        </div>}
      {userData != "" &&
        <div className="input-container">
          <input min={0} type="number" value={triesQuantity} onChange={({ target }) => setTriesQuantity(target.value === "" ? 0 : parseInt(target.value))} />
          {triesQuantity > 0 && <button type='button' className='tryBtn' onClick={handleMakeTriesQuantity}>Realizar {triesQuantity} {triesQuantity > 1 ? "tiradas" : "tirada"}</button>}
        </div>
      }

      {generated && <div className="try-summary-container">
        {triesData.map((myTry: tryData, index) => (
          <div key={myTry.seedsSurvive + "-" + index} className="try-container">
            <h3>Tirada # {index + 1}</h3>
            <p>Frutos iniciales: {myTry.initialFruits}</p>
            <p>Frutos comidos: {myTry.fruitsEated}</p>
            <p>Frutos finales: {myTry.frutosFinales}</p>
            <p>Semillas por fruto: {myTry.seedsPerFruit}</p>
            <p>Parto de {myTry.semillasIniciales} semillas</p>
            <p>Ratón se come el {myTry.percentageSeedsPerMouse}% = {myTry.seedsPerMouse} semillas</p>
            <p>Quedan {myTry.semillasDespuesDeRaton} semillas</p>
            <p>Germina el {myTry.percentageSeedsGerminate}% = {myTry.seedsGerminate} semillas</p>
            <div>Sobrevive el {myTry.percentageSeedsSurvive}% = <p className='boxed'> {myTry.seedsSurvive} plantulas</p></div>
          </div>
        ))}
      </div>
      }
      {finalData.promedio != "" && <div className="try-summary-container final-data">
        <p>Promedio = {finalData.promedio}</p>
        <p>Varianza = {finalData.varianza}</p>
        <p>Desviación estandar = {finalData.desviacionEstandar}</p>
        <p>Error estandar = {finalData.errorEstandar}</p>
        <p>Rango = {`${finalData.range[0]} <------> ${finalData.range[1]}`}</p>
      </div>
      }
    </>
  )
}

export default App
