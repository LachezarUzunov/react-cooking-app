import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./SmallRecipeItem.module.css";
import { storage } from "../../firebase";
import { listAll, ref, getDownloadURL } from "firebase/storage";

import Line from "../layout/Line";

const SmallRecipeItem = ({ recipe }) => {
  const [image, setImage] = useState();
  const imageListRef = ref(
    storage,
    `${recipe.user}/${recipe.title.split(" ").join("")}/`
  );

  useEffect(() => {
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImage(url);
        });
      });
    });
  }, []);

  const recipeExcerpt = recipe.preparation.substring(0, 150) + "...";

  return (
    <React.Fragment>
      <div className={classes.recipesList}>
        <img className={classes.smallPic} src={image} alt={recipe.title}></img>
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
