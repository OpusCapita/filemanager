import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './PlotlyDialog.less';
import Dialog from '../Dialog';
import Svg from '@opuscapita/react-svg/lib/SVG';
import icons from './icons-svg';

const propTypes = {
  readOnly: PropTypes.bool,
  headerText: PropTypes.string,
  fileName: PropTypes.string,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  getFileContent: PropTypes.func
};

const defaultProps = { 
  readOnly: false,
  headerText: '',
  fileName: '',
  onChange: () => {},
  onHide: () => {},
  onSubmit: () => {},
  onValidate: () => {},
  getFileContent: () => {}
};

let glob_view_plot_max_sized = 0;

export default
class PlotlyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plotlyData_sel: 0,
      plotlyData: {},
      plotDivs: [],
      view_plot_max_sized: glob_view_plot_max_sized
    };
  }

  componentDidMount() {
    this._isMounted = true
    this.initPlotlyData();
    this.loadPlotlyCDN();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  initPlotlyData = async (e) => {
    let value = await this.props.getFileContent(); 
    value = value.replaceAll("'", '"').split("/*$plotlyData$*/"); // change all ' to ", needed for the json parse and split them with the keyword to extract the data
    let valueArray = [];
    for (let i=1; i < value.length; i=i+2) // get data for all plots of the html file
    {
      try{
        valueArray.push(JSON.parse(value[i]));
      }catch(err){}
    }    
    this.setState({ plotlyData: valueArray });
    this.setPlotDivs();
    this.loadPlot();
  } 

  loadPlotlyCDN = () => {
    const existingScript = document.getElementById('plotly');  
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-basic-3.0.1.min.js';
      script.id = 'plotly';
      script.async = false;
      script.onload = () => console.log('Plotly loaded; Plotting called again!', this.setPlotDivs(), this.loadPlot());
      document.body.appendChild(script);
    }
    else{
      this.setPlotDivs();
      this.loadPlot();
    }
  }

  handleClose = async () => {
    await this.purgePlots();
    this.props.onHide();
    this.newText = null;
  }

  handleNext = async () => {
    this.setState({ plotlyData_sel: (this.state.plotlyData_sel + 1) >= this.state.plotlyData.length ? 0 : (this.state.plotlyData_sel + 1)});
  }

  handleBack = async () => {
    this.setState({ plotlyData_sel: (this.state.plotlyData_sel - 1) < 0 ? this.state.plotlyData.length -1 : (this.state.plotlyData_sel - 1)});
  }

  handleGridToggle = async () => {
    await this.purgePlots();
    this.setState({ view_plot_max_sized: (this.state.view_plot_max_sized == 0 ? 1 : 0 )});
    glob_view_plot_max_sized = this.state.view_plot_max_sized;
    this.setPlotDivs();
    this.loadPlot();
  }

  setPlotDivs = () => {    
    if(this.state.view_plot_max_sized == 0)
    {
      let value = [];
      for (var i = 0; i<this.state.plotlyData.length;i++)
      {
        value.push(<div id={this.state.plotlyData[i]["layout"]["title"]["text"]} className="oc-fm-plotly-dialog-plot_mult_plot"/>)
      }
      this.setState({ plotDivs : value});
    }
    else
    {
      this.setState({ plotDivs : [<div id="plot" class="oc-fm-plotly-dialog-plot"/>]});
    }
  }

  purgePlots = async () => {
    if( typeof Plotly === 'undefined') {
      console.log("Plotly not defined!")
    }
    else{
      try{  
        if(this.state.plotDivs.length >0){
          if(this.state.view_plot_max_sized == 0)
          {
            for (var i = 0; i<this.state.plotDivs.length;i++)
            {
              if (document.getElementById(this.state.plotlyData[i]["layout"]["title"]["text"]))
              {
                Plotly.purge(this.state.plotlyData[i]["layout"]["title"]["text"]);
              }
            }
            this.setState({ plotDivs : []});
          }
          else
          {
            if (document.getElementById('plot'))
            {
              Plotly.purge("plot");
              this.setState({ plotDivs : []});
            }
          }
        }
      }
      catch(e)
      {      
        console.log("TryCatch Purge Executed");
      }  
    }
  }

  loadPlot = () => {
    if( typeof Plotly === 'undefined') {
      console.log("Plotly not defined!")
    }
    else{
      try{  
        if (this.state.plotlyData.length > 0 && this.state.plotDivs.length > 0){
          if(this.state.view_plot_max_sized == 0)
          {        
            for (var i = 0; i<this.state.plotlyData.length;i++)
            {
              if (document.getElementById(this.state.plotlyData[i]["layout"]["title"]["text"]))
              {
                Plotly.react( 
                  this.state.plotlyData[i]["layout"]["title"]["text"], // Plot Figure ID
                  this.state.plotlyData[i]["data"], // Plot figure Data
                  this.state.plotlyData[i]["layout"], // Plot figure layout
                  {responsive: true}
                ); 
              }
            }
          }
          else
          {    
            if (document.getElementById('plot'))
            {
              Plotly.react( 
                "plot", // Plot Figure ID
                this.state.plotlyData[this.state.plotlyData_sel]["data"], // Plot figure Data
                this.state.plotlyData[this.state.plotlyData_sel]["layout"], // Plot figure layout
                {responsive: true}
              );  
            }
          }
        }
      }    
      catch(e)
      {      
        console.log("TryCatch Plot Executed - maybe no Data available");
      }      
    }
  }
  
  render() {
    const { onHide, headerText } = this.props;
    return (
      <Dialog className="oc-fm-plotly-dialog" onHide={this.handleClose}>
        <div className="oc-plotly--dialog__content" >
            
          <Svg
            className="oc-plotly--dialog__close-icon"
            svg={icons.close}
            title="Close"
            onClick={this.handleClose}
          />    

          <Svg
              className="oc-plotly--dialog__toggleView-icon"
              svg={this.state.view_plot_max_sized==1 ? icons.change_view_one : icons.change_view_all}
              title={this.state.view_plot_max_sized==1 ? "Show all plots smaller" : "Show plots maximized and one per page"}
              onClick={this.handleGridToggle}
            />                            
          
          {
            (this.state.view_plot_max_sized==1 && this.state.plotlyData.length>1) ? (
              <Svg
                className="oc-plotly--dialog__next-icon"
                svg={icons.next}
                title="Switch to next plot"
                onClick={this.handleNext}
              />   
            ) : null    
          }                       
            
          {
            (this.state.view_plot_max_sized==1 && this.state.plotlyData.length>1) ? (
              <Svg
                className="oc-plotly--dialog__back-icon"
                svg={icons.back}
                title="Switch to previous plot"
                onClick={this.handleBack}
              />        
            ) : null
          }

          <div className="oc-fm--dialog__header">
            {headerText}
          </div>  
          <div class="oc-fm-plotly-dialog-plot_scroll">
            {this.state.plotDivs}
          </div>
          {this.loadPlot()}

        </div>
      </Dialog>
    );
  }
}

PlotlyDialog.propTypes = propTypes;
PlotlyDialog.defaultProps = defaultProps;
