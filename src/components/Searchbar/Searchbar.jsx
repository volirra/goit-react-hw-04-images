import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { BiSearchAlt } from 'react-icons/bi';
import {
  SearchButton,
  StyledForm,
  Input,
  StyledSearchbar,
} from './Searchbar.styled';

function Searchbar({ onSubmit }) {
  const formik = useFormik({
    initialValues: {
      value: '',
    },
    onSubmit: values => {
      onSubmit(values.value);
      formik.resetForm();
    },
  });

  const { handleSubmit, handleChange, values } = formik;

  return (
    <StyledSearchbar>
      <StyledForm onSubmit={handleSubmit}>
        <SearchButton type="submit">
          <BiSearchAlt size={'70%'} color={'#0e7545'} />
        </SearchButton>

        <Input
          name="value"
          onChange={handleChange}
          value={values.value}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </StyledForm>
    </StyledSearchbar>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
