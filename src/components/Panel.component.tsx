import { useEffect, useState } from "react";
import "../App.css"
import { Parser } from "expr-eval";
enum SourceEnum {
    "Equation",
    "lowerBound",
    "upperBound",
    "step"
}
enum AlgorithmEnum {
    "rectangle",
    "trapezoidal",
    "simpsons"
}
const parser = new Parser();
const Panel = () => {
    const [upperBound, setUpperBound] = useState("");
    const [lowerBound, setLowerBound] = useState("");
    const [Equation, setEquation] = useState("");
    const [latexEquation, setLatexEquation] = useState("\\int_{}^{}x dx");
    const [step, setStep] = useState<string | null>("");
    const [algorithm, setAlgorithm] = useState<AlgorithmEnum>(AlgorithmEnum.rectangle);
    const parseItem = (item: string) => {
        item = item.replaceAll("*", "\\cdot ");
        item = item.replaceAll("/", "\\div ");
        item = item.replaceAll(",", ".");
        item = item.replaceAll("E", "e");
        item = item.replaceAll("PI", "\\Pi");
        item = item.replaceAll("exp ", "e^");
        item = item.replaceAll("sqrt ", "\\sqrt");
        item = item.replaceAll("(", "{");
        item = item.replaceAll(")", "}");

        return item;
    }
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, source: SourceEnum) => {
        let isParsed = true;
        try {
            Parser.evaluate(e.target.value);
        } catch (e) {
            isParsed = false;
        }
        switch (source) {
            case SourceEnum.Equation: {
                if (e.target.value !== "") {
                    document.querySelector(".fourth")?.classList.add("marg-top-1")
                } else {
                    document.querySelector(".fourth")?.classList.remove("marg-top-1")
                }
                setEquation(e.target.value);
                break;
            }
            case SourceEnum.lowerBound: {
                if (e.target.value !== "") {
                    document.querySelector(".second")?.classList.add("marg-top-1")
                } else {
                    document.querySelector(".second")?.classList.remove("marg-top-1")
                }

                if ((isNaN(Number(e.target.value)) && !isParsed) || (Number(e.target.value) >= Number(upperBound) && upperBound !== "")) {
                    e.target.classList.add("error");
                    break;
                }
                setLowerBound(e.target.value);
                e.target.classList.remove("error");
                break;
            }
            case SourceEnum.upperBound: {

                if ((isNaN(Number(e.target.value)) && !isParsed) || (Number(e.target.value) <= Number(lowerBound) && lowerBound !== "")) {
                    e.target.classList.add("error");
                    break;
                }
                setUpperBound(e.target.value);
                e.target.classList.remove("error");
                break;
            }
            case SourceEnum.step: {
                if (e.target.value !== "") {
                    document.querySelector(".third")?.classList.add("marg-top-1")
                } else {
                    document.querySelector(".third")?.classList.remove("marg-top-1")
                }
                console.log(e.target.valueAsNumber <= 0);
                if ((isNaN(Number(e.target.value)) && !isParsed) || Number(e.target.value) <= 0) {
                    e.target.classList.add("error");
                    break;
                }
                setStep(e.target.value);
                e.target.classList.remove("error");
                break;
            }
        }
    }
    useEffect(() => {
        setLatexEquation(`\\int_{${parseItem(lowerBound)}}^{${parseItem(upperBound)}}${parseItem(Equation)} dx`);
    }, [upperBound, lowerBound, Equation]);

    const calculate = () => {
        switch (algorithm) {
            case AlgorithmEnum.rectangle: {
                calculateRectangle();
                break;
            }
            case AlgorithmEnum.trapezoidal: {
                calculateTrapezoidal();
                break;
            }
            case AlgorithmEnum.simpsons: {
                calculateSimpsons();
                break
            }
        }
    }
    const calculateTrapezoidal = () => {
        if (document.querySelector(".error")) { return alert("Nieprawidłowe dane") }
        if (upperBound !== "" && lowerBound !== "" && Equation !== "" && step !== null) {
            try {
                const expression = parser.parse(Equation);
                let parsedUpperBound = parser.evaluate(upperBound);
                let parsedLowerBound = parser.evaluate(lowerBound);
                let increase = (parsedUpperBound - parsedLowerBound) / Number(step)
                let iterator = parsedLowerBound;
                let sum = 0;
                sum += Number(expression.evaluate({ x: parsedLowerBound }));
                for (let i = 0; i <= Number(step) - 2; i++) {
                    iterator += increase;
                    iterator = parseFloat(iterator.toFixed(12));
                    console.log(iterator);
                    sum += 2 * Number(expression.evaluate({ x: iterator }))
                }
                sum += Number(expression.evaluate({ x: parsedUpperBound }));
                sum *= increase / 2;
                setLatexEquation(`\\int_{${parseItem(lowerBound)}}^{${parseItem(upperBound)}}${parseItem(Equation)} dx \\approx ${sum}`)
            } catch (e) {
                alert("Nie udało się obliczyć")
            }
        } else {
            return alert("Brak danych")
        }
    }

    const calculateRectangle = () => {
        if (document.querySelector(".error")) { return alert("Nieprawidłowe dane") }
        if (upperBound !== "" && lowerBound !== "" && Equation !== "" && step !== null) {
            try {
                const expression = parser.parse(Equation);
                let parsedUpperBound = parser.evaluate(upperBound);
                let parsedLowerBound = parser.evaluate(lowerBound);
                let increase = (parsedUpperBound - parsedLowerBound) / Number(step); //h
                let iterator = parsedLowerBound;
                let sum = 0;
                iterator += (increase / 2);
                sum += Number(expression.evaluate({ x: iterator }))
                for (let i = 0; i <= Number(step) - 2; i++) {
                    iterator += increase;
                    iterator = parseFloat(iterator.toFixed(12));
                    console.log(iterator);
                    sum += Number(expression.evaluate({ x: iterator }))
                }
                sum *= increase;
                setLatexEquation(`\\int_{${parseItem(lowerBound)}}^{${parseItem(upperBound)}}${parseItem(Equation)} dx \\approx ${sum}`)
            } catch (e) {
                alert("Nie udało się obliczyć")
            }
        } else {
            return alert("Brak danych")
        }
    }
    const calculateSimpsons = () => {
        if (document.querySelector(".error")) { return alert("Nieprawidłowe dane") }
        if (upperBound !== "" && lowerBound !== "" && Equation !== "" && step !== null) {
            try {
                const expression = parser.parse(Equation);
                let parsedUpperBound = parser.evaluate(upperBound);
                let parsedLowerBound = parser.evaluate(lowerBound);
                let increase = (parsedUpperBound - parsedLowerBound) / Number(step)
                let iterator = parsedLowerBound;
                let sum = 0;
                sum += Number(expression.evaluate({ x: parsedLowerBound }));
                let multiplier: number;
                for (let i = 1; i <= Number(step) - 1; i++) {
                    iterator += increase;
                    iterator = parseFloat(iterator.toFixed(12));
                    console.log(iterator);
                    multiplier = (i % 2 === 0) ? 2 : 4;
                    sum += multiplier * Number(expression.evaluate({ x: iterator }));
                }
                sum += Number(expression.evaluate({ x: parsedUpperBound }));
                sum *= increase / 3;
                setLatexEquation(`\\int_{${parseItem(lowerBound)}}^{${parseItem(upperBound)}}${parseItem(Equation)} dx \\approx ${sum}`)
            } catch (e) {
                console.log(e);
                alert("Nie udało się obliczyć");
            }
        } else {
            return alert("Brak danych")
        }
    }

    return (
        <div className="appContainer">
            <div className="equation">
                <img alt={latexEquation} src={`https://latex.codecogs.com/svg.image?${latexEquation}`} ></img>
            </div>
            <div className="inputs">
                <div className="input-container first">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.upperBound)} ></input>
                    <label>Granica górna</label>
                </div>
                <div className="input-container second">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.lowerBound)}></input>
                    <label>Granica dolna</label>
                </div>
                <div className="input-container third">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.step)}></input>
                    <label>Krok</label>
                </div>
                <div className="input-container fourth">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.Equation)} value={Equation}></input>
                    <label>Wzór</label>
                </div>
                <div className="radio-container">
                    <div>
                        <input type="radio" name="algorithm" onClick={e => setAlgorithm(AlgorithmEnum.rectangle)} defaultChecked></input>
                        <label>Metoda prostokątów</label>
                    </div>
                    <div>
                        <input type="radio" name="algorithm" onClick={e => setAlgorithm(AlgorithmEnum.trapezoidal)}></input>
                        <label>Metoda trapezów</label>
                    </div>
                    <div>
                        <input type="radio" name="algorithm" onClick={e => setAlgorithm(AlgorithmEnum.simpsons)}></input>
                        <label>Metoda Simpsona</label>
                    </div>

                </div>
                <button onClick={calculate} className="calculateButton">Oblicz</button>
            </div>
        </div>
    )
}
export default Panel;