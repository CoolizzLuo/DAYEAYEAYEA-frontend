import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { COLOR, MEDIA_QUERY, FONT_SIZE } from '../../../constants/style'
import { GeneralBtn, EditBtn } from '../../../components/Button'
import { useForm } from "react-hook-form"
import useModal from '../../../hooks/useModal'
import useFetch from '../../../hooks/useFetch'


const Container = styled.div`
  width: 90%;
  margin: 24px auto;
  text-align: left;
`

const InfoWrapper = styled.div`
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Field = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 36px;

  h5, label, p {
    line-height: 36px;
  }

  h5, label {
    margin-right: 36px;
    font-weight: 700;
    font-size: ${FONT_SIZE.md};
  }

  p, input {
    font-size: ${FONT_SIZE.md};
  }

  input {
    padding: 0px 6px;
    border: 1px solid ${COLOR.border_light_grey};
    background: #eee;

    ${MEDIA_QUERY.desktop} {
      width: 290px;
    }
  }

  span {
    margin-left: 8px;
    color: red;
  }

  &+& {
    margin-top: 20px;
  }

  ${({$danger}) => $danger && `
    label {
      color: red;
    }
  `}
`

const BtnField = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    position: absolute;
    top: 16px;
    right: 12px;
    width: 100px;
    font-size: ${FONT_SIZE.md};

    button + button {
      margin-left: 8px;
    }

    ${MEDIA_QUERY.desktop} {
      width: 150px;
      font-size: ${FONT_SIZE.lg};
    }
`

const EditButton = ({ color, children, onClick }) => {
  const style = {
    width: '60%',
    fontSize: '14px'
  }
  return <EditBtn color={color} buttonStyle={style} children={children} onClick={onClick} />
}

const Button = ({ type, color, children, onClick }) => {
  const style = {
    width: '40%',
    fontSize: '14px'
  }
  return <GeneralBtn type={type} color={color} buttonStyle={style} children={children} onClick={onClick}/>
}


const Info = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { handleModalOpen, Modal } = useModal()
  const { fetchData: updateMe } = useFetch('/members/me', { method: 'PATCH'})
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = useCallback(async (data) => {
    setIsEditing(() => false)
    try {
      const { fullname, address, phone } = data
      profile.fullname = fullname
      profile.address = address
      profile.phone = phone

      updateMe({
        bodyData: { fullname, address, phone },
        handler: () => handleModalOpen('已更新會員資訊 ! '),
        errorHandler: () => handleModalOpen('更新會員資訊失敗 ! ')
      })
    } catch (error) {
      const { message } = error.response.data
      console.log(message)
    }
  }, [profile, updateMe, handleModalOpen])

  return (
    <Container>
      <Modal />
      <InfoWrapper>
        {
          !isEditing ? (
            <>
              <BtnField>
                <EditButton color={'accent'} onClick={() => setIsEditing(() => true)}>編輯</EditButton>
              </BtnField>
              <Field>
                <h5>帳號:</h5>
                <p>{ profile?.username }</p>
              </Field>
              <Field>
                <h5>電郵:</h5>
                <p>{ profile?.email }</p>
              </Field>
              <Field>
                <h5>姓名:</h5>
                <p>{ profile?.fullname }</p>
              </Field>
              <Field>
                <h5>地址:</h5>
                <p>{ profile?.address }</p>
              </Field>
              <Field>
                <h5>電話:</h5>
                <p>{ profile?.phone }</p>
              </Field>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <BtnField>
                <Button type="button" color={'accent'} onClick={() => setIsEditing(() => false)} >返回</Button>
                <Button type="submit" color={'warning'} >儲存</Button>
              </BtnField>
              <Field>
                <h5>帳號:</h5>
                <p>{ profile?.username }</p>
              </Field>
              <Field>
                <h5>電郵:</h5>
                <p>{ profile?.email }</p>
              </Field>
              <Field>
                <label>姓名:</label>
                <input 
                  $danger={errors.fullname}
                  type="text" 
                  placeholder="fullname"
                  defaultValue={profile?.fullname}
                  {...register(
                    "fullname", { 
                      pattern: {
                        value: /^[\u4e00-\u9fa5_a-zA-Z]{2,10}$/,
                        message: '請輸入中英文 2~10 字元'
                      }
                    }
                  )} 
                />
                { errors.fullname && <span>{ errors.fullname.message }</span> }
              </Field>
              <Field>
                <label>地址:</label>
                <input 
                  $danger={errors.address}
                  type="text" 
                  placeholder="address"
                  defaultValue={profile?.address}
                  {...register(
                    "address", { 
                      pattern: {
                        value: /^[\u4e00-\u9fa5_a-zA-Z1-9]{6,36}$/,
                        message: '請輸入正確的地址'
                      }
                    }
                  )} 
                />
                { errors.address && <span>{ errors.address.message }</span> }
              </Field>
              <Field>
                <label>電話:</label>
                <input 
                  $danger={errors.phone}
                  type="text" 
                  placeholder="phone"
                  defaultValue={profile?.phone}
                  {...register(
                    "phone", { 
                      pattern: {
                        value: /^(886)?09\d{8}$/,
                        message: '請輸入正確的電話號碼'
                      }
                    }
                  )} 
                />
                { errors.phone && <span>{ errors.phone.message }</span> }
              </Field>
            </form>
          )
        }
      </InfoWrapper>
    </Container>
  )
}

export default Info
