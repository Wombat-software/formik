import * as React from 'react';
import * as renderer from 'react-test-renderer';

import Formik, { InjectedFormikProps } from '../.';

import Yup from 'yup';

describe('Formik', () => {
  it('renders Formik correctly', () => {
    interface Props { thing: string }
    // when props and values are the same, you can pass just one generic to InjectedFormikProps
    const Form: React.SFC<InjectedFormikProps<Props>> = ({
      values,
      handleSubmit,
      handleChange,
      errors,
    }) => {
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handleChange}
            value={values.thing}
            name="thing"
          />
          {errors.thing && <div>{errors.thing}</div>}
          <input type="submit" value="Submit" />
        </form>
      );
    };

    const FormikEnhancer = Formik<Props>({
      validationSchema: Yup.object().shape({
        thing: Yup.string(),
      }),
      handleSubmit: payload => {
        console.log(payload);
      },
    });

    const EnhancedForm = FormikEnhancer(Form);

    const tree = renderer.create(<EnhancedForm thing="hello" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('mapsPropsToValues', () => {
    interface Props { hello: string }
    interface Values { thing: string }

    const Form: React.SFC<InjectedFormikProps<Props, Values>> = ({
      values,
      handleSubmit,
      handleChange,
      errors,
    }) => {
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handleChange}
            value={values.thing}
            name="thing"
          />
          {errors.thing && <div>{errors.thing}</div>}
          <input type="submit" value="Submit" />
        </form>
      );
    };

    const FormikEnhancer = Formik<Props, Values>({
      mapPropsToValues: ({ hello }) => ({ thing: hello }),
      validationSchema: Yup.object().shape({
        thing: Yup.string(),
      }),
      handleSubmit: payload => {
        console.log(payload);
      },
    });

    const EnhancedForm = FormikEnhancer(Form);

    const tree = renderer.create(<EnhancedForm hello="hello" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});