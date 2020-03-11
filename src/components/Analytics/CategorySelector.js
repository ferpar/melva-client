import React from "react";
import "./YearSelector.css";

const CategorySelector = ({ category, handleSetCategory, availableCategories }) => {
  const categoryMapper = {
    new: "nuevos",
    regained: "repescados",
    gained: "ganados",
    retained: "conservados",
    forgotten1Year: "olvidados 1 año",
    forgottenMultiYear: "olvidados multiaño"
  }
  return (
    <div className="year-select-container">
      <div className="year-select-wrapper">

          <div className="year-select-divider">
            <label htmlFor="year-select">Categoría</label>
            <select onChange={e => handleSetCategory(e)} id="year-select" name="year-select">
              <option 
                value={category ? category : null}
              >
                {category ? category: "---"}
              </option>
              {availableCategories
                .map( (category, ind) => (
                <option key={ind} value={category}>{categoryMapper[category]}</option>
              ))}
            </select>
          </div>

      </div>
    </div>
  )
}

export default CategorySelector
