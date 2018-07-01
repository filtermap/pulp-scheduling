import * as React from 'react'
import * as allModule from '../modules/all'

type Props = allModule.State & {
  replace(state: allModule.State): void
}

export default function All(props: Props) {
  return (
    <div>
      <h1>データ</h1>
      <h2>職員</h2>
      <table>
        <thead>
          <tr>
            <th>職員名</th>
          </tr>
        </thead>
        <tbody>
          {
            props.members.map(member => (
              <tr key={member.index}>
                <td>{member.name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <h2>期間</h2>
      <table>
        <thead>
          <tr>
            <th>開始日</th>
            <th>終了日</th>
          </tr>
        </thead>
        <tbody>
          {
            props.terms.map(term => (
              <tr key={term.index}>
                <td>{term.start_date_name}</td>
                <td>{term.stop_date_name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <h2>勤務</h2>
      <table>
        <thead>
          <tr>
            <th>勤務名</th>
          </tr>
        </thead>
        <tbody>
          {
            props.kinmus.map(kinmu => (
              <tr key={kinmu.index}>
                <td>{kinmu.name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <h2>グループ</h2>
      <table>
        <thead>
          <tr>
            <th>グループ名</th>
          </tr>
        </thead>
        <tbody>
          {
            props.groups.map(group => (
              <tr key={group.index}>
                <td>{group.name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <h2>グループに所属する職員</h2>
      <table>
        <thead>
          <tr>
            <th>グループ名</th>
            <th>職員名</th>
          </tr>
        </thead>
        <tbody>
          {
            props.group_members.map(group_member => (
              <tr key={group_member.index}>
                <td>{group_member.group_name}</td>
                <td>{group_member.member_name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <h2>連続禁止勤務並び</h2>
      <table>
        <thead>
          <tr>
            <th>並びID</th>
            <th>並び順</th>
            <th>勤務名</th>
          </tr>
        </thead>
        <tbody>
          {
            props.renzoku_kinshi_kinmus.map(renzoku_kinshi_kinmu => (
              <tr key={renzoku_kinshi_kinmu.index}>
                <td>{renzoku_kinshi_kinmu.sequence_id}</td>
                <td>{renzoku_kinshi_kinmu.sequence_number}</td>
                <td>{renzoku_kinshi_kinmu.kinmu_name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
