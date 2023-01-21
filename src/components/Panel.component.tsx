import { useEffect, useState } from "react";
import "../App.css"
import { Parser } from "expr-eval";
enum SourceEnum {
    "Equation",
    "lowerBound",
    "upperBound",
    "step"
}
const parser = new Parser();
const Panel = () => {
    const [upperBound, setUpperBound] = useState("");
    const [lowerBound, setLowerBound] = useState("");
    const [Equation, setEquation] = useState("");
    const [latexEquation, setLatexEquation] = useState("\\int_{}^{}xdx");
    const [step, setStep] = useState<string | null>("");
    const parseItem = (item: string) => {
        item = item.replaceAll("*", "\\cdot ");
        item = item.replaceAll("/", "\\div ");
        item = item.replaceAll(",", ".");
        item = item.replaceAll("E", "e ");
        item = item.replaceAll("PI", "\\Pi ");
        item = item.replaceAll("exp ", "e^");
        item = item.replaceAll("sqrt ", "\\sqrt");
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
                setEquation(e.target.value);
                break;
            }
            case SourceEnum.lowerBound: {
                if ((isNaN(e.target.valueAsNumber) && !isParsed) || (Number(e.target.value) >= Number(upperBound) && upperBound !== "")) {
                    e.target.classList.add("error");
                    break;
                }
                setLowerBound(e.target.value);
                e.target.classList.remove("error");
                break;
            }
            case SourceEnum.upperBound: {
                if ((isNaN(e.target.valueAsNumber) && !isParsed) || (Number(e.target.value) <= Number(lowerBound) && lowerBound !== "")) {
                    e.target.classList.add("error");
                    break;
                }
                setUpperBound(e.target.value);
                e.target.classList.remove("error");
                break;
            }
            case SourceEnum.step: {
                if ((isNaN(e.target.valueAsNumber) && !isParsed) || e.target.valueAsNumber <= 0) {
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
        if (document.querySelector(".error")) { return alert("Nieprawidłowe dane") }
        if (upperBound !== "" && lowerBound !== "" && Equation !== "" && step !== null) {
            try {
                const expression = parser.parse(Equation);
                console.log(expression.evaluate({ x: lowerBound }));
                let parsedUpperBound = parser.evaluate(upperBound);
                let parsedLowerBound = parser.evaluate(lowerBound);
                let increase = (parsedUpperBound - parsedLowerBound) / Number(step)
                let iterator = parsedLowerBound + increase;
                let sum = 0;
                sum += Number(expression.evaluate({ x: parsedLowerBound }));
                for (iterator; iterator < Number(parsedUpperBound); iterator += increase) {
                    sum += 2 * Number(expression.evaluate({ x: iterator }))
                }
                sum += Number(expression.evaluate({ x: iterator }));
                sum *= increase / 2;
                console.log(sum);
                setLatexEquation(`\\int_{${parseItem(lowerBound)}}^{${parseItem(upperBound)}}${parseItem(Equation)} dx \\approx ${sum}`)
            } catch (e) {
                alert("Nie udało się obliczyć")
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
                <div className="input-container">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.upperBound)} ></input>
                    <label>Granica górna</label>
                </div>
                <div className="input-container">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.lowerBound)}></input>
                    <label>Granica dolna</label>
                </div>
                <div className="input-container">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.step)}></input>
                    <label>Krok</label>
                </div>
                <div className="input-container">
                    <input type="text" required={true} onChange={e => handleInput(e, SourceEnum.Equation)} value={Equation}></input>
                    <label>Wzór</label>
                </div>
                <button onClick={calculate} className="calculateButton">Oblicz</button>
            </div>
        </div>
    )
}
export default Panel;