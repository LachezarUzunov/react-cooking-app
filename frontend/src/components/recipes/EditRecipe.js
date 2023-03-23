import classes from "./EditRecipe.module.css";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSingleRecipe, reset } from "../../features/recipes/recipeSlice";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";
import SingleIngredient from "./SingleIngredient";

import { storage } from "../../firebase";
import { listAll, ref, getDownloadURL } from "firebase/storage";

const EditRecipe = () => {
  const params = useParams();
  const { recipeId } = params;
  const [products, setProducts] = useState([]);
  const [item, setItem] = useState("");
  const [volume, setVolume] = useState("");
  const [type, setType] = useState("грама");
  const [loading, setLoading] = useState(false);
  const [imageListRef, setImageListRef] = useState();
  const [image, setImage] = useState();
  const [formData, setFormData] = useState({
    title: "",
    products: [],
    preparation: "",
    suitableFor: "",
    photos: "",
  });
  const postRecipe = true;
  const edit = true;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { recipe, isError, isSuccess, message } = useSelector(
    (state) => state.recipe
  );

  const currentTitle = recipe.title ? recipe.title : "";

  useEffect(() => {
    setImageListRef(
      ref(storage, `${recipe.user}/${currentTitle.split(" ").join("")}/`)
    );
  }, [currentTitle, recipe.user]);

  useEffect(() => {
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImage(url);
        });
      });
    });
  }, [imageListRef]);

  useEffect(() => {
    if (recipeId !== undefined) {
      dispatch(getSingleRecipe(recipeId));
    }
  }, [dispatch, recipeId]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      title: recipe.title,
      products: recipe.products,
      preparation: recipe.preparation,
      suitableFor: recipe.suitableFor,
      photos: recipe.photos,
    }));
  }, []);

  useEffect(() => {
    setProducts(formData.products);
  }, [formData.products]);
  // useEffect(() => {
  //   setOldProducts(formData.products)
  // }, [formData.products])

  const { photos, title, preparation, suitableFor } = formData;

  const onItemAdd = (e) => {
    setItem(e.target.value);
  };

  const onVolumeAdd = (e) => {
    setVolume(Number(e.target.value));
  };

  const onSelectType = (e) => {
    setType(e.target.value);
  };

  const onMutate = (e) => {
    if (e.target.name === "suitableFor") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: Number(e.target.value),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onProductsUpdate = (item) => {
    const updatedProducts = products.filter((product) => product.item !== item);

    setProducts(updatedProducts);
    setFormData((prevState) => ({
      ...prevState,
      products: updatedProducts,
    }));
  };

  const onProductAdd = (e) => {
    e.preventDefault();

    const newProduct = {
      item,
      volume,
      type,
    };

    setProducts((prevState) => [...prevState, newProduct]);
    setFormData((prevState) => ({
      ...prevState,
      products: products,
    }));
    setItem("");
    setType("грама");
    setVolume("");
  };

  const handlePhotoUpload = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      photos: e.target.files[0],
    }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    // if (isSuccess) {
    //   dispatch(reset());
    //   navigate("/recepti");
    // }
    dispatch(reset());
  }, [message, isError, isSuccess, navigate, dispatch]);

  console.log(recipe);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("products", JSON.stringify(products));
    formData.append("preparation", preparation);
    formData.append("suitableFor", suitableFor);
    formData.append("photos", photos);
    console.log(user);
    console.log(formData);
    try {
      const response = await fetch(
        `https://cook-master.onrender.com/api/posts/${recipeId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${user.token}`,
            // "Content-Type": "multipart/form-data: boundary=XXX",
          },
        }
      );

      if (response.status === 200) {
        const updatedRecipe = await response.json();
        setLoading(false);
        navigate("/");
        return updatedRecipe;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <main className={classes.main}>
        <section className={classes.background}>
          <section className={classes.content}>
            <div className={classes.title}>
              <h1>Здравей, {user.name}</h1>
              <h3 className={classes.info}>
                Намерил си начин да подобриш вкуса на своята рецепта? Добави
                промените оттук!
              </h3>
              <div className={classes.line}></div>
            </div>
            <div className={classes.form}>
              <form
                className={classes.formInside}
                onSubmit={onSubmit}
                encType="multipart/form-data"
              >
                <input
                  className={`${classes.inpitOpacity} ${classes.inputField}`}
                  type="text"
                  placeholder="Мусака с тиквички..."
                  name="title"
                  id="title"
                  value={title}
                  onChange={onMutate}
                  required
                />
                <p className={classes.white}>Съставки:</p>
                {products.length > 0
                  ? products.map((product) => (
                      <SingleIngredient
                        postRecipe={postRecipe}
                        product={product}
                        key={product.item}
                        products={products}
                        onProductsUpdate={onProductsUpdate}
                        edit={edit}
                      />
                    ))
                  : null}
                <article className={classes.ingredient}>
                  <input
                    type="text"
                    placeholder="Морков, домат, лук..."
                    name="product"
                    id="product"
                    value={item}
                    onChange={onItemAdd}
                  />
                  <input
                    type="text"
                    placeholder="количество..."
                    name="quantity"
                    id="quantity"
                    value={volume}
                    onChange={onVolumeAdd}
                  />
                  <select
                    onChange={onSelectType}
                    value={type}
                    name="ingredient-type"
                    id="kilo"
                  >
                    <option value="грама">грама</option>
                    <option value="мл.">мл.</option>
                    <option value="брой(я).">брой(я)</option>
                    <option value="на вкус">На вкус</option>
                  </select>
                  <button
                    className={classes.addIngredient}
                    onClick={onProductAdd}
                  >
                    <FaPlusCircle />
                  </button>
                </article>

                <p className={classes.white}>
                  Стъпките за приготвянето на твоя шедьовър
                </p>
                <textarea
                  className={classes.textArea}
                  name="preparation"
                  id="preparation"
                  cols="10"
                  rows="10"
                  value={preparation}
                  onChange={onMutate}
                  required
                ></textarea>

                <div className={classes.suitable}>
                  <p className={classes.white}>Подходяща за</p>
                  <select
                    className={classes.suitableSelect}
                    name="suitableFor"
                    id="suitable"
                    onChange={onMutate}
                    value={suitableFor}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>

                  <p className={classes.white}>човека.</p>
                </div>
                <div>
                  {recipe.photos !== undefined ? (
                    <div>
                      <img
                        className={classes.singlePhoto}
                        src={image}
                        alt="recipe"
                      ></img>
                    </div>
                  ) : null}
                </div>
                {/* <div className={classes.upload__button}>
                  <label className={classes.upload} htmlFor="photos">
                    Добави снимки
                  </label>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="photos"
                    id="photos"
                    filename="photos"
                    onChange={handlePhotoUpload}
                    required
                  />
                </div> */}

                <button className="btn__primary">РЕДАКТИРАЙ</button>
              </form>
            </div>
          </section>
        </section>
      </main>
    </Fragment>
  );
};

export default EditRecipe;
