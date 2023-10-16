/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Form, Input, Modal } from "antd";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fab);

import request from '../server/Server';

import '../App.css';

const GlobalPage = () => {
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    getData();
  }, []);


  async function getData() {
    try {
      setIsLoading(true)
      let {
        data
      } = await request.get(`/tmc`);
      setData(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }


  const edit = async (id) => {
    setSelected(id);
    try {
      setShowForm(true);
      let { data } = await request.get(`/tmc/${id}`);
      setIsLoading(false);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };


  const deleteCategory = async (id) => {
    console.log(id);
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        setIsLoading(true)
        await request.delete(`/tmc/${id}`);
        getData();
      } catch (err) {
        console.log(err);
      }
    }
  };



  const handleAddClick = () => {
    setSelected(null);
    setShowForm(true);
    form.resetFields()
  };

  const closeModal = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {

      setIsLoading(true)
      let formData = await form.validateFields();
      console.log(formData);
      if (selected === null) {
        await request.post("/tmc", formData);
        setIsLoading(false);
      } else {
        console.log(selected);
        await request.put(`/tmc/${selected}`, formData);
        setIsLoading(false);
      }
      getData();
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <div className='loading'>
      <div className="loading-wave">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>;
    </div>
  }



  return (
    <section className="skills">
      <div className="containers my-5 gap-3">
        <a href="https://www.instagram.com/mv.nuriddin/" target='blank'>
          <FontAwesomeIcon icon={['fab', 'instagram']} id="instagram" />
        </a>
        <a href="https://app.netlify.com/teams/maxmutov-nuriddin/sites" target='blank'>
          <FontAwesomeIcon icon={['fab', 'github-square']} id="netlify" />
        </a>
        <a href="https://t.me/mv_nuriddin" target='blank'>
          <FontAwesomeIcon icon={['fab', 'telegram']} id="telegram" />
        </a>
      </div>
      <div className="container">
        <div className="skills__header">
          <h2 className="skills__title">Person <span className='skills__title-count'></span></h2>
          <button className="skills__button skills__button--add" onClick={handleAddClick}>
            Add
          </button>
        </div>
        <div className="skills__table-wrapper">
          <table className="skills__table">
            <thead>
              <tr>
                <th className="skills__table-header">Name</th>
                <th className="skills__table-header">Percent</th>
                <th className="skills__table-header">Result</th>
                <th className="skills__table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((category) => (
                <tr key={category.id} className="skills__row">
                  <td className="skills__name">{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</td>
                  <td className="skills__description">{category.ball}</td>
                  <td className="skills__description">
                    {(() => {
                      if (category.ball >= 0 && category.ball <= 56) {
                        return 'Unsatisfied';
                      } else if (category.ball >= 57 && category.ball <= 70) {
                        return 'Satisfactory';
                      } else if (category.ball >= 71 && category.ball <= 85) {
                        return 'Good';
                      } else if (category.ball >= 86 && category.ball <= 100) {
                        return 'Exceled';
                      }
                    })()}
                  </td>
                  <td className="skills__actions">
                    <button
                      className="skills__button skills__button--edit"
                      onClick={() => edit(category.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="skills__button skills__button--delete"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        title="Category data"
        open={showForm}
        onOk={handleFormSubmit}
        onCancel={closeModal}
        okText={selected ? "Save person" : "Add person"}
      >
        <Form
          form={form}
          name="skill"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Person name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please fill !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Percent"
            name="ball"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default GlobalPage;
