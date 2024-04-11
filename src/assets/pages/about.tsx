import raduImage from "../images/radu.jpg";
import Background from "../constants/background/background";
import "../styles/about.css";

const AboutComponent = () => {
  return (
    <div className="about">
      <Background></Background>
      <div className="person">
        <h2>About Us</h2>
        <img src={raduImage} alt="Radu" className="pic" />
        <div className="text">
          <h5>
            Front-end Developer & <span>Designer</span>
          </h5>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
            natus ad sed harum itaque ullam enim quas, veniam accusantium, quia
            animi id eos adipisci iusto molestias asperiores explicabo cum vero
            atque amet corporis! Soluta illum facere consequuntur magni. Ullam
            dolorem repudiandae cumque voluptate consequatur consectetur, eos
            provident necessitatibus reiciendis corrupti!
          </p>
          <div className="data">
            <a href="#" className="hire">
              Contact
            </a>
          </div>
        </div>
      </div>

      <div className="persons-container">
        <Background></Background>
        {/* Persoana 2 */}
        <div className="person">
          <img src={raduImage} alt="Radu's Child 1" className="person-image" />
          <div className="text">
            <h3>Radu's Child 1</h3>
            <h5>
              Front-end Developer & <span>Designer</span>
            </h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              natus ad sed harum itaque ullam enim quas, veniam accusantium,
              quia animi id eos adipisci iusto molestias asperiores explicabo
              cum vero atque amet corporis! Soluta illum facere consequuntur
              magni. Ullam dolorem repudiandae cumque voluptate consequatur
              consectetur, eos provident necessitatibus reiciendis corrupti!
            </p>
            <div className="data">
              <a href="#" className="hire">
                Contact
              </a>
            </div>
          </div>
        </div>
        {/* Persoana 3 */}
        <Background></Background>
        <div className="person">
          <img src={raduImage} alt="Radu's Child 1" className="person-image" />
          <div className="text">
            <h3>Radu's Child 1</h3>
            <h5>
              Front-end Developer & <span>Designer</span>
            </h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              natus ad sed harum itaque ullam enim quas, veniam accusantium,
              quia animi id eos adipisci iusto molestias asperiores explicabo
              cum vero atque amet corporis! Soluta illum facere consequuntur
              magni. Ullam dolorem repudiandae cumque voluptate consequatur
              consectetur, eos provident necessitatibus reiciendis corrupti!
            </p>
            <div className="data">
              <a href="#" className="hire">
                Contact
              </a>
            </div>
          </div>
        </div>
        {/* Persoana 4 */}
        <Background></Background>
        <div className="person">
          <img src={raduImage} alt="Radu's Child 1" className="person-image" />
          <div className="text">
            <h3>Radu's Child 1</h3>
            <h5>
              Front-end Developer & <span>Designer</span>
            </h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              natus ad sed harum itaque ullam enim quas, veniam accusantium,
              quia animi id eos adipisci iusto molestias asperiores explicabo
              cum vero atque amet corporis! Soluta illum facere consequuntur
              magni. Ullam dolorem repudiandae cumque voluptate consequatur
              consectetur, eos provident necessitatibus reiciendis corrupti!
            </p>
            <div className="data">
              <a href="#" className="hire">
                Contact
              </a>
            </div>
          </div>
        </div>
        <Background></Background>
        <div className="person">
          <img src={raduImage} alt="Radu's Child 1" className="person-image" />
          <div className="text">
            <h3>Radu's Child 1</h3>
            <h5>
              Front-end Developer & <span>Designer</span>
            </h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              natus ad sed harum itaque ullam enim quas, veniam accusantium,
              quia animi id eos adipisci iusto molestias asperiores explicabo
              cum vero atque amet corporis! Soluta illum facere consequuntur
              magni. Ullam dolorem repudiandae cumque voluptate consequatur
              consectetur, eos provident necessitatibus reiciendis corrupti!
            </p>
            <div className="data">
              <a href="#" className="hire">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
