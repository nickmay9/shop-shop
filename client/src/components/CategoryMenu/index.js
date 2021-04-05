import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import store from '../../utils/store';
import { useSelector } from 'react-redux';

function CategoryMenu() {

  const categories = useSelector(state => store.getState().categories);

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if(categoryData){
      store.dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        store.dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }

  }, [categoryData, loading]);

  const handleClick = id => {
    store.dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  }

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
          <button
            key={item._id}
            onClick={() => {
              handleClick(item._id);
            }}
          >
            {item.name}
          </button>
        ))
      }
    </div>
  );
}

export default CategoryMenu;
