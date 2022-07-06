import "antd/dist/antd.css";
import "./App.css";
import { Button, Table, Modal, Input } from "antd";
import { useState,useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
let cont = 0;
function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [dataSource, setDataSource] = useState([
    {
      id: 1,
      name: "Cerre",
      level: 20,
      team: "",
    },
    {
      id: 2,
      name: "El Carmona",
      level: 60,
      team: "",
    },
    {
      id: 3,
      name: "Adriankelele",
      level: 50,
      team: "",
    },
    {
      id: 4,
      name: "Machacasamu",
      level: 67,
      team: "",
    },
    {
      id: 5,
      name: "Wondep",
      level: 75,
      team: "",
    },
    {
      id: 6,
      name: "Japicuco",
      level: 55,
      team: "",
    },
    {
      id: 7,
      name: "SuperDuck",
      level: 69,
      team: "",
    },
    {
      id: 8,
      name: "Fika",
      level: 86,
      team: "",
    },
    {
      id: 9,
      name: "Condiso",
      level: 55,
      team: "",
    },
    {
      id: 10,
      name: "Capitán Latinoamérica",
      level: 90,
      team: "",
    },
  ]);
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Nombre",
      dataIndex: "name",
    },
    {
      key: "3",
      title: "Nivel",
      dataIndex: "level",
    },
    {
      key: "5",
      title: "Editar",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setDataSource(() => {
      return sameItem;
    });
  }, []);

  function FastAssignment(players) {
    const sorted = players.sort((a, b) => b.level - a.level);
    // init with first two highest skilled players
    let team_a = [sorted.shift()];
    let team_b = [sorted.shift()];
    // start tracking total skill for each team
    let score_a = team_a[0].level;
    let score_b = team_b[0].level;
    // check them 2 at a time
    // assumes array is always divisible by two
    while (sorted.length > 0) {
        let a = sorted.shift()
        let b = sorted.shift()
        let high, low;
        // figure out which is higher / lower
        if (a.level >= b.level) {
            high = a;
            low = b;
        } else {
            high = b;
            low = a;
        }
        // check total score for team
        // assign lower skilled player to higher scored team
        if (score_a >= score_b) {
            team_a.push(low)
            team_b.push(high)
            score_a += low.level
            score_b += high.level
        } else {
            team_a.push(high)
            team_b.push(low)
            score_a += high.level
            score_b += low.level
        }
    }
    return [team_a, team_b]
}

function PrintTeamPair(pair) {
  const [team_a, team_b] = pair;
  setDataSource(() => {
    return team_a.concat(team_b);
  });
}

function ShuffleTeamPair(pair){
    const [team_a, team_b] = pair;
    let selections = [];
    for (let i = 0; i < team_a.length; i++) {
        let a = [...team_a.slice(0, i), team_b[i], ...team_a.slice(i+1)];
        let b = [...team_b.slice(0, i), team_a[i], ...team_b.slice(i+1)];
        selections.push([a, b])
    }
    return selections;
}

const printTeams = () => {
  if (cont <= 4) {
    const two_teams = FastAssignment(dataSource);
    const shuffled = ShuffleTeamPair(two_teams);
    let pair = shuffled[cont];
    let id1 = 1;
    let id2 = 6;
    for(let i=0 ; i<=4 ; i++){
      pair[0][i].id = id1;
      id1++;
    }
    for(let j=0 ; j<=4 ; j++){
      pair[1][j].id = id2;
      id2++;
    }
    PrintTeamPair(pair);
    cont++;
  } else {
    setTimeout(window.location.reload(false), 5000);
    alert("No hay más combinaciones");
  }
};

if(localStorage.length === 0){window.localStorage.setItem("players",JSON.stringify(dataSource));}
let sameItem = JSON.parse(localStorage.getItem("players"));

  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };
  return (
    <div className="App">
      <div>
      <header className="App-header">   
        <Button id="buttonTeams" onClick={printTeams}>Hacer equipos</Button>
        <Table  
        rowKey="index" 
        rowClassName={(record, index) => {
          return record.id <= 5 ? "green" : "red";
        }}
         
        pagination={false} 
        columns={columns} 
        dataSource={dataSource}>
        </Table>
        <Modal
          title="Editar nivel"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((student) => {
                if (student.id === editingStudent.id) {
                  for(var i = 0;i < sameItem.length; i++){
                    if (dataSource[i].id === editingStudent.id) {
                        sameItem[i].level = parseInt(editingStudent.level);
                        break;
                    }
                }
                localStorage.setItem('players',JSON.stringify(sameItem))
                  return editingStudent;
                } else {
                  return student;
                }
              });
            });
            resetEditing();
          }}
        >
          <Input
            value={editingStudent?.name}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, name: e.target.value };
              });
            }}
          />
          <Input
            value={editingStudent?.level}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, level: e.target.value };
              });
            }}
          />
        </Modal>
      </header>
      </div>
    </div>
  );
}

export default App;
