import { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import {
  Wrapper,
  ColumnHeader,
  Header,
  TableItemContainer
} from '../TableStyle'
import OrderItem from './OrderItem'
import { GeneralBtn, LogoutBtn } from '../../Button'
import { ADMIN_COLOR } from '../../../constants/style'
import { useForm } from 'react-hook-form'
import { updateMemberLevel } from '../../../webAPI/adminMembersAPI'
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid transparent;
  padding: 40px 0px;
`
const MemberWrapper = styled.div`
  background: ${ADMIN_COLOR.light_grey};
  position: relative;
  padding: 20px 30px;
  margin: 40px 0px;
`

const List = styled.div`
  margin: 30px;
`
const ListTitle = styled.span`
  margin-right: 20px;
  font-weight: bold;
`
const ListData = styled.span``

const EditButton = styled.div`
  width: 100px;
  position: absolute;
  top: 20px;
  right: 30px;
`
const Msg = styled.div`
  text-align: center;
  padding: 30px;
`
const RestyleHeader = styled(Header)`
  width: 12%;
  width: ${({ $name }) => $name === 'Email' && '38%'};
  width: ${({ $name }) => $name === '訂單編號' && '26%'};
`
const headerNames = ['訂單狀態', '訂單編號', 'Email', '訂單金額', 'Edit']
export default function AdminMemberDetail({ member, setMember }) {
  const location = useHistory()
  const [isEdit, setIsEdit] = useState(false)
  const handleEdit = () => {
    isEdit ? setIsEdit(false) : setIsEdit(true)
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      level: member.level
    }
  })
  const onSubmit = async (submitData) => {
    const result = await updateMemberLevel(member.id, submitData.level)
    if (result.ok === 0) {
      console.log(result.message)
      return false
    }
    setMember({ ...member, level: submitData.level })
    alert('已編輯完成!')
    handleEdit()
  }

  return (
    <PageWrapper>
      <LogoutBtn
        onClick={() => {
          setMember(null)
          location.push('/admin/members')
        }}
        color={'admin_blue'}
        children={'回訂單列表'}
        buttonStyle={{ width: '120px' }}
      />
      <Wrapper>
        <MemberWrapper>
          <List>
            <ListTitle>帳號:</ListTitle>

            <ListData children={member.username} />
          </List>
          <List>
            <ListTitle>信箱:</ListTitle>

            <ListData children={member.email} />
          </List>
          <List>
            <ListTitle>名稱:</ListTitle>

            <ListData children={member.fullname} />
          </List>
          <List>
            <ListTitle>電話:</ListTitle>

            <ListData children={member.phone} />
          </List>
          <List>
            <ListTitle>地址:</ListTitle>

            <ListData children={member.address} />
          </List>
          <List>
            <ListTitle>會員等級:</ListTitle>
            {!isEdit && <ListData children={member.level} />}
            {isEdit && (
              <select {...register('level')}>
                <option value='normal'>normal</option>
                <option value='vip'>vip</option>
              </select>
            )}
          </List>
          <EditButton onClick={isEdit ? handleSubmit(onSubmit) : handleEdit}>
            <GeneralBtn
              children={isEdit ? '儲存' : '編輯'}
              color={isEdit ? 'admin_blue' : 'admin_grey'}
            />
          </EditButton>
        </MemberWrapper>
        <ColumnHeader>
          {headerNames.map((name) => (
            <RestyleHeader key={name} $name={name}>
              {name}
            </RestyleHeader>
          ))}
        </ColumnHeader>

        <TableItemContainer>
          {!member.Orders.length && <Msg>客人還沒有訂單喔!</Msg>}
          {member.Orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </TableItemContainer>
      </Wrapper>
    </PageWrapper>
  )
}
