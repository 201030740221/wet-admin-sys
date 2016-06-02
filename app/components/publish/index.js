import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Menu, Dropdown,Popover, message,Icon,Table,Tag,Form, Select,Input, Row, Col, Modal, Button,Pagination } from 'antd';
const FormItem = Form.Item;

import BaseForm from '../common/base-form';


var Index = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
    getInitialState: function () {
        return {
        	source: {},
        	loading: true
        };
    },
    componentDidMount: function () {
       
    },
    componentDidUpdate(){

    },

    render: function () {

    	let self = this;
    
         let data = [
      {
        title: '基本信息',
        formData: [
          {
            type: 'input',
            title: '供应商编号',
            key: 'no',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '供应商名称',
            key: 'name',
            defaultValue: '',
            placeholder: '请输入供应商名称，100字节内',
            validator: {
              required: true,
              maxLength: 100,
              message: {
                required: '必填，100字内'
              }
            }
          }, {
            type: 'select',
            title: '供应商类型',
            key: 'type',
            defaultValue: '1',
            values: [
              {
                name: '制造商',
                key: '1',
                disabled: false
              }, {
                name: '贸易公司',
                key: '2',
                disabled: false
              }
            ]
          }, {
            type: 'input',
            title: '工厂全称',
            key: 'factory_name',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              maxLength: 100,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '工厂编号',
            key: 'factory_no',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'radio',
            title: '是否品牌',
            key: 'is_brand',
            defaultValue: '1',
            values: [
              {
                name: '否',
                key: '0',
                disabled: false
              }, {
                name: '是',
                key: '1',
                disabled: false
              }
            ]
          }, {
            type: 'radio',
            title: '是否通过初审',
            key: 'first_audit',
            defaultValue: '0',
            values: [
              {
                name: '否',
                key: '0',
                disabled: false
              }, {
                name: '是',
                key: '1',
                disabled: false
              }
            ]
          }, {
            type: 'datepicker',
            title: '首次合作时间',
            key: 'cooperation_time',
            defaultValue: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '下一步行动',
            key: 'next_step',
            defaultValue: '',
            placeholder: ''
          }, {
            type: 'input',
            title: '工厂地址',
            key: 'factory_address',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '税率',
            key: 'tax_rate',
            defaultValue: '',
            placeholder: '',
            validator: {
              number: true,
              message: {
                number: '数字'
              }
            }
          }, {
            type: 'input',
            title: '斯品负责人',
            key: 'principal',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'textarea',
            title: '备注',
            key: 'note',
            defaultValue: '',
            placeholder: ''
          }
        ]
      }, {
        title: '供应商联系方式',
        formData: [
          {
            type: 'input',
            title: '姓名',
            key: 'supplier_contact_name',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '职位',
            key: 'supplier_contact_job',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '电子邮箱',
            key: 'supplier_contact_email',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              email: true,
              message: {
                required: '必填',
                email: '邮箱格式'
              }
            }
          }, {
            type: 'input',
            title: '联系电话',
            key: 'supplier_contact_tel',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }
        ]
      }, {
        title: '工厂联系方式',
        formData: [
          {
            type: 'input',
            title: '姓名',
            key: 'factory_contact_name',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '职位',
            key: 'factory_contact_job',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }, {
            type: 'input',
            title: '电子邮箱',
            key: 'factory_contact_email',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              email: true,
              message: {
                required: '必填',
                email: '邮箱格式'
              }
            }
          }, {
            type: 'input',
            title: '联系电话',
            key: 'factory_contact_tel',
            defaultValue: '',
            placeholder: '',
            validator: {
              required: true,
              message: {
                required: '必填'
              }
            }
          }
        ]
      }, {
        title: '综合评估',
        sectionType: 'custom',
        formData: [
          {
            title: '技术/质量',
            key: 'technique',
            defaultValue: '1'
          }, {
            title: '交期',
            key: 'lead_time',
            defaultValue: '1'
          }, {
            title: '配合度',
            key: 'cooperation',
            defaultValue: '1'
          }, {
            title: '综合',
            key: 'comprehensive',
            defaultValue: '1'
          }
        ],
        render: function () {
          return (<div></div>);
        }
      }
    ];

    let actionButtons = [
      {
        title: '保 存',
        onClick: function (validator) {
          validator(function (isValid, validData) {
            if (!isValid) {
              SP.message.error('填写有误！');
            } else {
              _this.props.onSubmit(validData);
            }
          });
        }
      }
    ];
    // 属性改变导致的二次渲染，其中radio，select类型的选中值不会随之改变
    return (<BaseForm data={data} actionButtons={actionButtons}/>);
    }
});

module.exports = Index;