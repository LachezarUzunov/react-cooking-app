import React from "react";
import { Link } from "react-router-dom";
import classes from "./SmallRecipeItem.module.css";

import Line from "../layout/Line";

const SmallRecipeItem = ({ recipe }) => {
  const recipeExcerpt = recipe.preparation.substring(0, 150) + "...";
  const user = recipe.user;
  console.log(recipe);
  return (
    <React.Fragment>
      <div className={classes.recipesList}>
        <img
          className={classes.smallPic}
          src={`https://cook-master-backend.onrender.com/uploads/${recipe.photos}`}
          alt={recipe.title}
        ></img>
        <div>
          <h2 className={classes.mobi__title}>{recipe.title}</h2>
          <Line />
          {/* <Link to={`/profile/${user}`}>Виж</Link> */}
          <p className={classes.recipeExerpt}>{recipeExcerpt}</p>
          <div className={classes.btnDiv}>
            <Link className="btn__primary" to={`/recepti/${recipe._id}`}>
              ВИЖ ПОВЕЧЕ
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SmallRecipeItem;
