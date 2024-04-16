import styles from "./Footer.css";
import logo from "./logo.png";
import { useState } from "react";

const Footer = () => {
  const [devTeam, setDevTeam] = useState(false);

  return (
    <footer className="container">
      <div className={styles.MainFooterContent}>
        <div className={cx(styles.footerItems)} id="footerContent">
          <div className={styles.QuotesContainer}>
            <div className={styles.quotes}>
              Our Workshop is a tapestry of innovation, where ideas converge,
              and solutions emerge.
            </div>
          </div>

          <div>
            <div className={styles.LogoContainer}>
              <div className={styles.title}>RGIPT IPO'24</div>
            </div>
          </div>
        </div>
        <div className={styles.footerItems}>
          <div>
            <p>Contact us</p>
            <ul className={styles.SocialHandles}>
              <li className={cx(styles["handle-wrapper"])}>
                <a
                  className={styles.handle}
                  target="_blank"
                  rel="noreferrer"
                  href="face book link"
                >
                  <svg
                    role="presentation"
                    aria-label="Facebook"
                    aria-hidden="true"
                  >
                    <use href="/media/icons/sprite.svg#social-facebook"></use>
                  </svg>
                </a>
              </li>
              <li className={cx(styles["handle-wrapper"])}>
                <a
                  className={styles.handle}
                  target="_blank"
                  rel="noreferrer"
                  href="insta link"
                >
                  <svg
                    role="presentation"
                    aria-label="Twitter"
                    aria-hidden="true"
                  >
                    <use href="/media/icons/sprite.svg#social-instagram"></use>
                  </svg>
                </a>
              </li>
              <li className={cx(styles["handle-wrapper"])}>
                <a
                  className={styles.handle}
                  target="_blank"
                  rel="noreferrer"
                  href="mailto:mail id"
                >
                  <MailIcon />
                </a>
              </li>
              <li className={cx(styles["handle-wrapper"])}>
                <a
                  className={styles.handle}
                  target="_blank"
                  rel="noreferrer"
                  href="https://chat.whatsapp.com/HmcowbF1mbG7DRJxti4X4X"
                >
                  <WAIcon />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.thanks}>
            <span>Thank you</span>
            <br />
            <span>for your support</span>
          </div>
          <div>
            <img
              src={bye}
              style={{ height: "160px", width: "auto" }}
              alt=""
            ></img>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className={styles.team}>
          <span className={styles.sep}>~</span>
          <span>&copy; 2024 IPO WORKSHOP RGIPT</span>
          {devTeam && (
            <ul className={styles.devteam}>
              <li>
                <a
                  className={cx("link", styles.ln)}
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/rixitgithub"
                >
                  @rixit
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;