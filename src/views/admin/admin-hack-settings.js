import React from 'react';
import Separator from '../../util/separator.js';
import {
  InputText,
  InputCheckbox,
  InputTextarea,
  InputSelect,
} from '../../components/input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Section, Row } from '../../components/layout';

class AdminHackSettings extends React.Component {
  constructor(props) {
    super(props);
    const {
      hackBannerImg,
      description,
      difficulty,
      name,
      hackPublished,
      hackSlug,
      startDate,
      hackThumbImg,
      registrationOpen,
      displayOptions,
      whitelist,
    } = props.hackData;

    let defaultDisplayOptions = {
      forumEnabled: false,
      calendarEnabled: false,
      taskEnabled: false,
      tutorialEnabled: false,
      resultsEnabled: false,
      rulesEnabled: false,
      projectsEnabled: false,
      quizEnabled: false,
    }

    this.state = {
      whitelist: whitelist || [''],
      displayOptions: displayOptions || defaultDisplayOptions,
      registrationOpen: registrationOpen || false,
      hackPublished: hackPublished || false,
      hackBannerImg: hackBannerImg || '',
      hackName: name || '',
      hackDifficulty: difficulty || null,
      hackDescription: description || '',
      hackSlug: hackSlug || '',
      hackThumbImg: hackThumbImg || '',
      syncing: false,
      submitDisabled: false,
      startDate: startDate ? new Date(Date.parse(startDate)) : new Date(),
    }

    this.onHackBannerImgChanged = this.onHackBannerImgChanged.bind(this);
    this.onHackNameChanged = this.onHackNameChanged.bind(this);
    this.onHackPublishedChanged = this.onHackPublishedChanged.bind(this);
    this.onHackSlugChanged = this.onHackSlugChanged.bind(this);
    this.onHackThumbImgChanged = this.onHackThumbImgChanged.bind(this);
    this.onRegistrationOpenChanged = this.onRegistrationOpenChanged.bind(this);
    this.submitSettings = this.submitSettings.bind(this);
    this.onHackDescriptionChanged = this.onHackDescriptionChanged.bind(this);
    this.onHackDifficultyChanged = this.onHackDifficultyChanged.bind(this);
    this.onHackStartDateChanged = this.onHackStartDateChanged.bind(this);
    this.onDisplayOptionsChanged = this.onDisplayOptionsChanged.bind(this);
  }

  onHackStartDateChanged(value){
    this.setState({startDate: value})
  }

  onHackBannerImgChanged(name, value){
    this.setState({hackBannerImg: value})
  }

  onHackThumbImgChanged(name, value){
    this.setState({hackThumbImg: value})
  }

  onHackDifficultyChanged(name, value){
    this.setState({hackDifficulty: value})
  }

  onHackNameChanged(name, value){
    this.setState({hackName: value})
  }

  onHackDescriptionChanged(name, value){
    this.setState({hackDescription: value})
  }

  onHackSlugChanged(name, value){
    this.setState({hackSlug: value})
  }

  onDisplayOptionsChanged(name, value){
    let display = this.state.displayOptions;
    display[name] = value;
    this.setState({displayOptions: display})
  }

  onRegistrationOpenChanged(name, value) {
    if (this.state.syncing) {
      return false;
    }
    this.setState({syncing: true})

    window.firebase.firestore()
      .collection('hacks')
      .doc(this.props.hackId)
      .update({registrationOpen: value})
      .then(() => {
        this.setState({
          registrationOpen: value,
          syncing: false,
        })
      })
  }

  onHackPublishedChanged(name, value) {
    if (this.state.syncing) {
      return false
    }
    this.setState({syncing: true})

    window.firebase.firestore()
      .collection('hacks')
      .doc(this.props.hackId)
      .update({hackPublished: value})
      .then(() => {
        this.setState({
          hackPublished: value,
          syncing: false
        })
      })
  }

  submitSettings() {
    if (this.state.syncing) {
      return false
    }

    this.setState({
      syncing: true,
      submitDisabled: true,
    })

    const filterText = (text) => {
      return text.replace(/[^a-zA-Z0-9- ]/g, '')
    };

    const filterDescription = (text) => {
      return text.replace(/[^a-zA-Z0-9-.,()"'/ ]/g, '')
    };

    const filterUrl = (path) => {
      return path.toLowerCase()
        .replace(/[^a-zA-Z0-9- ]/g, '')
        .replace(/ /g, '-')
    }

    let hackBannerImg = this.state.hackBannerImg.trim();
    let hackThumbImg = this.state.hackThumbImg.trim();
    let hackDifficulty = this.state.hackDifficulty;
    let hackName = filterText(this.state.hackName.trim());
    let hackDescription = filterDescription(this.state.hackDescription.trim());
    let displayOptions = this.state.displayOptions;
    let hackSlug = filterUrl(this.state.hackSlug.trim());
    let startDate = this.state.startDate;

    if (!this.state.hackSlug) {
      hackSlug = filterUrl(hackName);
    }

    window.firebase.firestore()
      .collection('hacks')
      .doc(this.props.hackId)
      .update({
        hackBannerImg: hackBannerImg,
        description: hackDescription,
        displayOptions: displayOptions,
        difficulty: hackDifficulty,
        name: hackName,
        hackSlug: hackSlug,
        hackThumbImg: hackThumbImg,
        startDate: startDate.toISOString(),
      })
      .then(() => {
        this.setState({
          hackBannerImg: hackBannerImg,
          hackDescription: hackDescription,
          displayOptions: displayOptions,
          hackDifficulty: hackDifficulty,
          hackName: hackName,
          hackSlug: hackSlug,
          hackThumbImg: hackThumbImg,
          startDate: startDate,
          syncing: false,
          submitDisabled: false,
        })
        window.location.reload();
      })
  }

  render() {
    return (
      <>
        <h2>
          {this.props.hack.name} Settings
        </h2>

        <Separator primary />

        <Section sectionClass="py-2">
          <InputText
            containerClass="flex py-1 flex-between"
            inputClass="mx-2 flex-3"
            labelClass="flex-1"
            name="hack_name"
            label="Name"
            value={this.state.hackName || ''}
            onInputChange={this.onHackNameChanged}
          />

          <InputText
            containerClass="flex py-1 flex-between"
            inputClass="mx-2 flex-3"
            labelClass="flex-1"
            name="hack_slug"
            label="Slug"
            value={this.state.hackSlug || ''}
            onInputChange={this.onHackSlugChanged}
          />

          <InputSelect
            name="hack_dificulty"
            containerClass="flex align-items-center"
            labelClass="mr-2"
            inputClass="flex-1"
            label="Dificulty"
            value={this.state.hackDifficulty}
            options={[
              {label: 'Beginner', name: 'beginner'},
              {label: 'Intermediate', name: 'intermediate'},
              {label: 'Advanced', name: 'advanced'},
            ]}
            onInputChange={this.onHackDifficultyChanged}
          />

          <InputTextarea
            containerClass="flex py-1 flex-between"
            inputClass="mx-2 flex-3"
            labelClass="flex-1"
            name="hack_description"
            label="Description"
            value={this.state.hackDescription || ''}
            onInputChange={this.onHackDescriptionChanged}
          />

          <h3 className="h3 py-2">
            Hack Media
          </h3>

          <InputText
            containerClass="flex py-1 flex-between"
            inputClass="mx-2 flex-2"
            labelClass="flex-1"
            name="hack_banner"
            label="Hack Banner Image URL"
            icon="image"
            iconClass="pl-1 pr-2"
            value={this.state.hackBannerImg || ''}
            onInputChange={this.onHackBannerImgChanged}
          />

          <InputText
            containerClass="flex py-1 flex-between"
            inputClass="mx-2 flex-2"
            labelClass="flex-1"
            name="hack_thumb"
            label="Hack Image Thumbnail"
            icon="image"
            iconClass="pl-1 pr-2"
            value={this.state.hackThumbImg || ''}
            onInputChange={this.onHackThumbImgChanged}
          />

          <h2 className="h2 pt-3">
            Hack Options
          </h2>

          <InputCheckbox
            label="Hack Published"
            name="hackPublished"
            onInputChange={this.onHackPublishedChanged}
            isChecked={this.state.hackPublished}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Registration Open"
            name="registrationOpen"
            onInputChange={this.onRegistrationOpenChanged}
            isChecked={this.state.registrationOpen}
            disabled={this.state.syncing}
          />

          <h3 className="h3 my-2" style={{verticalAlign: 'center'}}>
            Display Options
          </h3>

          <InputCheckbox
            label="Calendar Enabled"
            name="calendarEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.calendarEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Forum Enabled"
            name="forumEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.forumEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Projects Enabled"
            name="projectsEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.projectsEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Results Enabled"
            name="resultsEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.resultsEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Quiz Enabled"
            name="quizEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.quizEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Rules Enabled"
            name="rulesEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.rulesEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Task Enabled"
            name="taskEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.taskEnabled}
            disabled={this.state.syncing}
          />

          <InputCheckbox
            label="Tutorial Enabled"
            name="tutorialEnabled"
            onInputChange={this.onDisplayOptionsChanged}
            isChecked={this.state.displayOptions.tutorialEnabled}
            disabled={this.state.syncing}
          />
        </Section>

        <Section sectionClass="py-2">
          <div className="flex align-content-center py-2">
            <h3 className="h3 my-0 mr-2" style={{verticalAlign: 'center'}}>
              Start Date
            </h3>

            <DatePicker
              selected={this.state.startDate}
              onChange={this.onHackStartDateChanged}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
              timeIntervals={60}
            />
          </div>


        </Section>

        <Section>
          <Row rowClass="flex justify-content-center bg-grey-lt2 py-4 mr-5 mb-5">
            <button
              className="btn btn- bg-primary px-8"
              onClick={this.submitSettings}
              disabled={this.state.submitDisabled}
            >
              Submit
            </button>
          </Row>
        </Section>
      </>
    )
  }
}

export default AdminHackSettings;
