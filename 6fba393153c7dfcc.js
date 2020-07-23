// https://observablehq.com/@siyant/ge2020-smcs-results-analysis@719
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# GE2020 SMCs results analysis 🇸🇬🗳📊🤔

Singapore's 18th general election was held on 10 July 2020 amidst the Covid-19 pandemic. As a first time voter, I diligently followed the news, had frequent discussions on campaign issues, and stayed up until 4am to watch the results! 😪 

The day after polling day, while looking at the results on the newspaper, I wondered if any trends could be unearthed from the results. To keep things simple, I decided to look at **Single Member Constituencies (SMCs) only**. Here is my little analysis on the GE2020 results!`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**For a start, how many candidates contest from each party and how did they fare?**

💡 You can hover over/ click on data points on the chart to see more info!`
)});
  main.variable(observer()).define(["smcData","ytitle","html","Plotly"], function(smcData,ytitle,html,Plotly)
{
  const smcDataSorted = smcData.sort((a,b) => a.votePercent < b.votePercent)
  
  const partyCount = {}
  for (let s of smcData) {
    if (partyCount[s.party]) partyCount[s.party] += 1
    else partyCount[s.party] = 1
  }
  
  const data = [{
    type: 'scatter',
    x: smcDataSorted.map(s => s.party),
    y: smcDataSorted.map(s => s.votePercent),
    mode: 'markers',
    name: 'Vote percent',
    text: smcData.map(s => `${s.candidate} (${s.constituency})`),
    marker: {
      color: '#9CC136',
      opacity: 0.6,
      symbol: 'circle',
      size: 14
    }
  }, {
    type: 'bar',
    x: Object.keys(partyCount),
    y: Object.values(partyCount),
    name: 'No. of candidates',
    width: 0.5,
    marker: { color: '#FBC259' }
  }]
  
  const layout = {
    title: "SMC result by party",
    // width: 800,
    height: 640,
    hovermode: 'closest',
    margin: { l: 30, r: 20, t: 120, b:120 },
    xaxis : { fixedrange: true },
    yaxis: {
      showgrid: false,
      showline: true,
      fixedrange: true
    },
    legend: { bgcolor: '#eeeeee', xanchor: 'right', yanchor: 'top'},
    annotations: [ytitle]
  }
  
  const div = html`<div id="party" style="max-width: 800px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`The PAP contested all 14 SMCs, while the opposition parties managed to co-operate and send 1 candidate to each SMC. This successfully avoided three-corner fights, which tend to benefit the PAP (except in Pioneer which had an independent candidate in addition to PAP and PSP). 

Results wise, no surprises here. PAP candidates clearly take the lead, followed by the more established parties WP and SDP. Despite being a new party, PSP did pretty well too, as did SPP's chairman Jose Raymond. For the other 4... 😖 better luck next time?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Gender trends

This election saw a record number of female candidates (40 in total, including GRCs). Among SMC candidates, there were 8 females and 21 males.`
)});
  main.variable(observer()).define(["smcData","html","Plotly"], function(smcData,html,Plotly)
{
  const parties = { 'PAP': null, 'WP': null, 'SDP': null, 'PSP': null }
  for (let p of Object.keys(parties)) {
    const pdata = {'Male': 0, 'Female': 0}
    smcData.filter(s => s.party === p).forEach(s => pdata[s.gender] += 1)
    parties[p] = pdata
  }
  let pdata = {'Male': 0, 'Female': 0}
    smcData.filter(s => s.party !== 'PAP').forEach(s => pdata[s.gender] += 1)
    parties['Oppo'] = pdata
  
  const colors = ['#02c3aa', '#7600ff']
  function traceFields(party) {
    return {
      title: party,
      name: party,
      type: 'pie',
      values: Object.values(parties[party]),
      labels: Object.keys(parties[party]),
      marker: { colors },
      textposition: "inside",
      textinfo: "value"
    }
  }
  
  const data = [{
    ...traceFields('PAP'),
    domain: { row: 0, column: 0 }
  }, {
    ...traceFields('Oppo'),
    title: 'Opp total',
    name: 'Opp total',
    domain: { row: 0, column: 1 }
  }, {
    ...traceFields('WP'),
    domain: { row: 0, column: 2 }
  }, {
    ...traceFields('SDP'),
    domain: { row: 0, column: 3 }
  }, {
    ...traceFields('PSP'),
    domain: { row: 0, column: 4 }
  }];

  let layout = {
    title: "SMC candidates' gender breakdown",
    height: 400,
    // width: 800,
    grid: {rows: 1, columns: 5, xgap: 0.15},
    margin: { l: 20, r: 20, t: 120, b:80 },
    legend: { bgcolor: '#eeeeee', orientation: 'h', x: 0.4, yanchor: 'bottom', traceorder: 'reversed'}
  };

  const div = html`<div id="gender-split" style="max-width: 800px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["html"], function(html){return(
html`<p style="font-size:0.8em; color: #666">(Note: Only parties with more than 1 candidate are plotted. SPP, PPP, PV, RP and Independent had 1 candidate each, and they all happen to be male.)<p>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`

Good job to the PAP, WP and PSP for fielding a significant proportion of female candidates! 👏🏼`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`From my eyeball analysis of the results in the newspaper, it seemed like female candidates generally performed better than males. And the data seems to back this up, with a **13% higher** median vote percentage for females as compared to males:`
)});
  main.variable(observer()).define(["smcData","ytitle","html","Plotly"], function(smcData,ytitle,html,Plotly)
{
  const genders = ['Female', 'Male']
  const data = genders.map(x => {
    const traceData = smcData.filter(s => s.gender === x)
    return {
      type: 'box',
      boxpoints: 'all',
      name: x,
      width: 0.4,
      y: traceData.map(s => s.votePercent),
      text: traceData.map(s => `${s.candidate} (${s.constituency}, ${s.party})`),
      marker: { color: x === 'Female' ? '#7600ff' : '#02c3aa' }
    }
  })
  
  const layout = {
    title: "SMC result by gender",
    // width: 600,
    height: 500,
    margin: { l: 30, r: 20, t: 120, b:80 },
    xaxis : { fixedrange: true },
    yaxis: {
      showgrid: false,
      showline: true,
      fixedrange: true
    },
    showlegend: false,
    annotations: [ytitle]
  }
  
  const div = html`<div id="gender" style="max-width: 600px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`GIRL POWERRR 🎉👊💥

But, wait a minute. 

For the female data, we can see the the top 5 scorers out of the 8 females are from the PAP. Whereas for males, there are 12 opposition and only 9 PAP candidates. So maybe the difference is just due to the PAP candidates pulling up the average for females?

To test this theory, I further split the data by PAP/opposition.`
)});
  main.variable(observer()).define(["smcData","ytitle","html","Plotly"], function(smcData,ytitle,html,Plotly)
{
  const genders = ['Female', 'Male']
  const papData = genders.map(x => {
    const traceData = smcData.filter(s => s.party === 'PAP' && s.gender === x)
    return {
      type: 'box',
      boxpoints: 'all',
      jitter: 0.4,
      name: `PAP ${x}`,
      width: 0.4,
      y: traceData.map(s => s.votePercent),
      text: traceData.map(s => `${s.candidate} (${s.constituency}, ${s.party})`),
      marker: { color: x === 'Female' ? '#7600ff' : '#02c3aa' }
    }
  })
  
  const oppoData = genders.map(x => {
    const traceData = smcData.filter(s => s.party !== 'PAP' && s.gender === x)
    return {
      type: 'box',
      boxpoints: 'all',
      jitter: 0.4,
      name: `Opposition ${x}`,
      width: 0.4,
      y: traceData.map(s => s.votePercent),
      text: traceData.map(s => `${s.candidate} (${s.constituency}, ${s.party})`),
      marker: { color: x === 'Female' ? '#7600ff' : '#02c3aa' }
    }
  })
  
  const data = papData.concat(oppoData)
  
  const layout = {
    title: "SMC result by party and gender",
    // width: 800,
    height: 500,
    margin: { l: 30, r: 20, t: 120, b:80 },
    xaxis : { fixedrange: true },
    yaxis: {
      showgrid: false,
      showline: true,
      fixedrange: true
    },
    showlegend: false,
    annotations: [ytitle]
  }
  
  const div = html`<div id="party-gender" style="max-width: 800px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`So, when we plot the data this way, the results for male and female candidates' look pretty much on par. Among the opposition, the median result for females is 3% higher than the median for males. But with just 3 data points for the female side, it's pretty inconclusive. 

**❓But what happened to the earlier 13% gap??**

This is an example of Simpson's paradox! The trend from the combined data disappears when split into more categories, because the categories of data make up different proportions of the total. (You can [read about Simpson's paradox and how 2 opposite arguments can be proven with the same data here](https://towardsdatascience.com/simpsons-paradox-how-to-prove-two-opposite-arguments-using-one-dataset-1c9c917f5ff9)! Really cool stuff.)

In our case, the 13% gap emerged in the total simply because the female candidates are majority PAP and male candidates are majority opposition, and we already know that ~~the PAP always wins~~ a candidate' party greatly influences his/her result.

On a side note, how did Kayla, Gigene and Chen Chen (all 3 female opposition candidates) get virtually the exact same result?! 🤯`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Racial trends

Since I started learning more about politics in Singapore, I've been curious about PAP implementing the GRC system "to ensure minority representation in Parliament". If the PAP wants more minority representation in parliament, can't they just achieve that by fielding more minority candidates themselves since PAP is almost sure to win? 🤔 If their claim is that it is difficult for minority candidates to win in single seats, then surely this claim can be either backed up or refuted by data.`
)});
  main.variable(observer()).define(["smcData","html","Plotly"], function(smcData,html,Plotly)
{
  const parties = { 'PAP': null, 'WP': null, 'SDP': null, 'PSP': null }
  for (let p of Object.keys(parties)) {
    const pdata = {'Chinese': 0, 'Indian': 0}
    smcData.filter(s => s.party === p).forEach(s => pdata[s.race] += 1)
    parties[p] = pdata
  }
  let pdata = {'Chinese': 0, 'Indian': 0}
    smcData.filter(s => s.party !== 'PAP').forEach(s => pdata[s.race] += 1)
    parties['Opp'] = pdata
  
  const colors = ['#41D9D6', '#FAA033']
  function traceFields(party) {
    return {
      title: party,
      name: party,
      type: 'pie',
      values: Object.values(parties[party]),
      labels: Object.keys(parties[party]),
      marker: { colors },
      textposition: "inside",
      textinfo: "value"
    }
  }
  
  const data = [{
    ...traceFields('PAP'),
    domain: { row: 0, column: 0 }
  }, {
    ...traceFields('Opp'),
    title: 'Opp total',
    name: 'Opp total',
    domain: { row: 0, column: 1 }
  }, {
    ...traceFields('WP'),
    domain: { row: 0, column: 2 }
  }, {
    ...traceFields('SDP'),
    domain: { row: 0, column: 3 }
  }, {
    ...traceFields('PSP'),
    domain: { row: 0, column: 4 }
  }];

  let layout = {
    title: "SMC candidates' race breakdown",
    height: 400,
    // width: 800,
    grid: {rows: 1, columns: 5, xgap: 0.2},
    margin: { l: 20, r: 20, t: 120, b:80 },
    legend: { bgcolor: '#eeeeee', orientation: 'h', x: 0.4, yanchor: 'bottom', traceorder: 'reversed'}
  };
  
  const div = html`<div id="race-split" style="max-width: 800px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Some interesting demographics here. Out of all the 29 candidates fielded in SMCs, there were only Chinese and Indian candidates. The opposition has a pretty high share of Indian candidates, comprising 1 each from the SDP, PSP, SPP, PV and RP.

Given the PAP's smaller percentage of Indian candidates compared to the opposition, Simpson's paradox is likely to come into play here too. Hence, instead of just splitting the data by race, we should consider both party and race in our analysis.`
)});
  main.variable(observer()).define(["smcData","ytitle","html","Plotly"], function(smcData,ytitle,html,Plotly)
{
  const races = ['Chinese', 'Indian']
  const papData = races.map(x => {
    const traceData = smcData.filter(s => s.party === 'PAP' && s.race === x)
    return {
      type: 'box',
      boxpoints: 'all',
      jitter: 0.4,
      name: `PAP ${x}`,
      width: 0.4,
      y: traceData.map(s => s.votePercent),
      text: traceData.map(s => `${s.candidate} (${s.constituency}, ${s.party})`),
      marker: { color: x === 'Chinese' ? '#41D9D6': '#FAA033' }
    }
  })
  
  const oppoData = races.map(x => {
    const traceData = smcData.filter(s => s.party !== 'PAP' && s.race === x)
    return {
      type: 'box',
      boxpoints: 'all',
      jitter: 0.4,
      name: `Opposition ${x}`,
      width: 0.4,
      y: traceData.map(s => s.votePercent),
      text: traceData.map(s => `${s.candidate} (${s.constituency}, ${s.party})`),
      marker: { color: x === 'Chinese' ? '#41D9D6': '#FAA033' }
    }
  })
  
  const data = papData.concat(oppoData)
  
  const layout = {
    title: "SMC result by party and race",
    // width: 800,
    height: 500,
    margin: { l: 30, r: 20, t: 120, b:80 },
    xaxis : { fixedrange: true },
    yaxis: {
      showgrid: false,
      showline: true,
      fixedrange: true
    },
    showlegend: false,
    annotations: [ytitle]
  }
  
  const div = html`<div id="party-race" style="max-width: 800px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`
Unfortunately, PAP only fielded 1 minority race candidate (Murali Pillai) and in a tough fight against SDP chief Chee Soon Juan. So minority candidates definitely can win single seats, but we can't really draw any conclusions from the single data point.

On the opposition side, the data points are similarly distributed mostly between 26 and 46%. While there is a slight difference in the median vote percentage, it is too small to be significant. On the whole, this chart seems to indicate that Singaporeans do not significantly penalize candidates from minority races in SMC contests.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## What else? Experience?

What, then, are important factors that influence a candidate's vote share? Qualities like the candidate's background, personality and outreach on the ground would certainly be important to voters, but these cannot be easily quantified and compared. 

One factor I thought to explore was the number of terms that the candidate had served as an MP before, as it reflects how experienced they are in serving citizens. Candidates who have been MPs before should also be more well-known to the residents compared to new faces introduced this election.`
)});
  main.variable(observer()).define(["smcData","ytitle","html","Plotly"], function(smcData,ytitle,html,Plotly)
{
  const data = [{
    type: 'scatter',
    y: smcData.map(s => s.votePercent),
    x: smcData.map(s => s.nTermsAsMp),
    mode: 'markers',
    name: 'Vote percent',
    text: smcData.map(s => `${s.candidate} (${s.constituency})`),
    marker: {
      color: '#9CC136',
      opacity: 0.6,
      symbol: 'circle',
      size: 12
    }
  }]
  
  const layout = {
    title: "SMC result by MP experience",
    // width: 800,
    height: 600,
    hovermode: 'closest',
    margin: { l: 30, r: 20, t: 120, b:80 },
    xaxis : { 
      title: 'No. of previous terms as MP',
      fixedrange: true, 
      zeroline: false 
    },
    yaxis: {
      showgrid: false,
      showline: true,
      fixedrange: true,
      range: [35, 75]
    },
    annotations: [ytitle]
  }
  
  const div = html`<div id="party" style="max-width: 600px;"></div>`
  Plotly.newPlot(div, data, layout, { responsive: true });
  return div
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`For this chart, I plotted PAP MPs only, to see if longer-serving MPs are more popular in elections. On the whole, candidates who have previous experience serving as MPs have higher vote percentages of generally above 60% and going up to 70-75%. However, a lot still depends on the individual match-up in each SMC.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## So, how do Singaporeans vote?

In any election, much of the outcome depends on unquantifiable factors such as candidates' reputation, publicity and outreach on the ground, as well as the history and sentiments of voters in the constituency. From this small analysis, we only looked at a small number of factors, and found that:

- Voters prefer certain (larger, more established ⚡️🔨) parties over others
- Candidates' gender and race do not seem to significantly sway the vote 
  - Because of Simpson's paradox, we should split the data into appropriate categories for comparison
- Among PAP candidates, those who have served as MPs previously are able to get higher vote percentages than new faces

Nothing very groundbreaking, but looks like good trends for our society's democratic future! ✨
`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<hr>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Say hi

Have any questions or comments? Contact me on [Twitter](https://twitter.com/siyanified) or email (hello@teosiyan.com)!

Feel free to fork my [Observable notebook](https://observablehq.com/@siyant/ge2020-smcs-results-analysis) to do your own explorations :)`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Setup

Data used for all the visualizations are from this smcData array, which I compiled from various sources.`
)});
  main.variable(observer("smcData")).define("smcData", function(){return(
[
  {
    "constituency": "Bukit Batok",
    "nVoters": 29948,
    "candidate": "Murali Pillai",
    "party": "PAP",
    "opposingParty": "SDP",
    "gender": "Male",
    "race": "Indian",
    "nTermsInWard": 1,
    "nTermsAsMp": 1,
    "votePercent": 54.8,
    "voteCount": 15476
  },
  {
    "constituency": "Bukit Batok",
    "nVoters": 29948,
    "candidate": "Chee Soon Juan",
    "party": "SDP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 45.2,
    "voteCount": 12764
  },
  {
    "constituency": "Bukit Panjang",
    "nVoters": 35437,
    "candidate": "Liang Eng Hwa",
    "party": "PAP",
    "opposingParty": "SDP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 3,
    "votePercent": 53.74,
    "voteCount": 18070
  },
  {
    "constituency": "Bukit Panjang",
    "nVoters": 35437,
    "candidate": "Paul Tambyah",
    "party": "SDP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Indian",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 46.26,
    "voteCount": 15556
  },
  {
    "constituency": "Hong Kah North",
    "nVoters": 28046,
    "candidate": "Amy Khor",
    "party": "PAP",
    "opposingParty": "PSP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": 4,
    "nTermsAsMp": 4,
    "votePercent": 60.98,
    "voteCount": 16333
  },
  {
    "constituency": "Hong Kah North",
    "nVoters": 28046,
    "candidate": "Gigene Wong",
    "party": "PSP",
    "opposingParty": "PAP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 39.02,
    "voteCount": 10452
  },
  {
    "constituency": "Hougang",
    "nVoters": 26432,
    "candidate": "Dennis Tan",
    "party": "WP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 1,
    "votePercent": 61.19,
    "voteCount": 15416
  },
  {
    "constituency": "Hougang",
    "nVoters": 26432,
    "candidate": "Lee Hong Chuang",
    "party": "PAP",
    "opposingParty": "WP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 0,
    "votePercent": 38.81,
    "voteCount": 9776
  },
  {
    "constituency": "Kebun Baru",
    "nVoters": 22623,
    "candidate": "Henry Kwek",
    "party": "PAP",
    "opposingParty": "PSP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 1,
    "nTermsAsMp": 1,
    "votePercent": 62.97,
    "voteCount": 13284
  },
  {
    "constituency": "Kebun Baru",
    "nVoters": 22623,
    "candidate": "Kumaran Pillai",
    "party": "PSP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Indian",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 37.03,
    "voteCount": 7812
  },
  {
    "constituency": "MacPherson",
    "nVoters": 28513,
    "candidate": "Tin Pei Ling",
    "party": "PAP",
    "opposingParty": "PPP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": 1,
    "nTermsAsMp": 2,
    "votePercent": 71.74,
    "voteCount": 18983
  },
  {
    "constituency": "MacPherson",
    "nVoters": 28513,
    "candidate": "Goh Meng Seng",
    "party": "PPP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 28.26,
    "voteCount": 7477
  },
  {
    "constituency": "Marymount",
    "nVoters": 23431,
    "candidate": "Gan Siow Huang",
    "party": "PAP",
    "opposingParty": "PSP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 0,
    "votePercent": 55.04,
    "voteCount": 12143
  },
  {
    "constituency": "Marymount",
    "nVoters": 23431,
    "candidate": "Ang Yong Guan",
    "party": "PSP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 44.96,
    "voteCount": 9918
  },
  {
    "constituency": "Mountbatten",
    "nVoters": 24246,
    "candidate": "Lim Biow Chuan",
    "party": "PAP",
    "opposingParty": "PV",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 2,
    "nTermsAsMp": 3,
    "votePercent": 73.84,
    "voteCount": 16227
  },
  {
    "constituency": "Mountbatten",
    "nVoters": 24246,
    "candidate": "Sivakumaran Chellappa",
    "party": "PV",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Indian",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 26.16,
    "voteCount": 5748
  },
  {
    "constituency": "Pioneer",
    "nVoters": 24653,
    "candidate": "Patrick Tay",
    "party": "PAP",
    "opposingParty": "PSP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 1,
    "votePercent": 61.98,
    "voteCount": 14571
  },
  {
    "constituency": "Pioneer",
    "nVoters": 24653,
    "candidate": "Lim Cher Hong",
    "party": "PSP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 35.24,
    "voteCount": 8285
  },
  {
    "constituency": "Pioneer",
    "nVoters": 24653,
    "candidate": "Cheang Peng Wah",
    "party": "Independent",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 2.78,
    "voteCount": 654
  },
  {
    "constituency": "Potong Pasir",
    "nVoters": 19731,
    "candidate": "Sitoh Yih Pin",
    "party": "PAP",
    "opposingParty": "SPP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 2,
    "nTermsAsMp": 2,
    "votePercent": 60.69,
    "voteCount": 11232
  },
  {
    "constituency": "Potong Pasir",
    "nVoters": 19731,
    "candidate": "Jose Raymond",
    "party": "SPP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Indian",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 39.31,
    "voteCount": 7275
  },
  {
    "constituency": "Punggol West",
    "nVoters": 26587,
    "candidate": "Sun Xueling",
    "party": "PAP",
    "opposingParty": "WP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": 1,
    "nTermsAsMp": 1,
    "votePercent": 60.97,
    "voteCount": 15637
  },
  {
    "constituency": "Punggol West",
    "nVoters": 26587,
    "candidate": "Tan Chen Chen",
    "party": "WP",
    "opposingParty": "PAP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 39.03,
    "voteCount": 10012
  },
  {
    "constituency": "Radin Mas",
    "nVoters": 24931,
    "candidate": "Melvin Yong",
    "party": "PAP",
    "opposingParty": "RP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 1,
    "votePercent": 74.03,
    "voteCount": 16834
  },
  {
    "constituency": "Radin Mas",
    "nVoters": 24931,
    "candidate": "Kumar Appavoo",
    "party": "RP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Indian",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 25.97,
    "voteCount": 5905
  },
  {
    "constituency": "Yio Chu Kang",
    "nVoters": 25962,
    "candidate": "Yip Hon Weng",
    "party": "PAP",
    "opposingParty": "PSP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": 0,
    "nTermsAsMp": 0,
    "votePercent": 60.83,
    "voteCount": 14756
  },
  {
    "constituency": "Yio Chu Kang",
    "nVoters": 25962,
    "candidate": "Kayla Low",
    "party": "PSP",
    "opposingParty": "PAP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 39.17,
    "voteCount": 9500
  },
  {
    "constituency": "Yuhua",
    "nVoters": 21351,
    "candidate": "Grace Fu",
    "party": "PAP",
    "opposingParty": "SDP",
    "gender": "Female",
    "race": "Chinese",
    "nTermsInWard": 3,
    "nTermsAsMp": 3,
    "votePercent": 70.54,
    "voteCount": 14111
  },
  {
    "constituency": "Yuhua",
    "nVoters": 21351,
    "candidate": "Robin Low",
    "party": "SDP",
    "opposingParty": "PAP",
    "gender": "Male",
    "race": "Chinese",
    "nTermsInWard": "",
    "nTermsAsMp": "",
    "votePercent": 29.46,
    "voteCount": 5894
  }
]
)});
  main.variable(observer("Plotly")).define("Plotly", ["require"], function(require){return(
require("https://cdn.plot.ly/plotly-latest.min.js")
)});
  main.variable(observer("ytitle")).define("ytitle", function(){return(
{ font: { size: 14 }, text: 'Votes (%)', showarrow: false, xref: 'paper', x: -0.03, yref: 'paper', y: 1.1 }
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Sources and references

The Straits Times for election data, especially [this](https://www.straitstimes.com/multimedia/graphics/2020/07/singapore-general-election-ge2020-live-results/index.html) and [this](https://www.straitstimes.com/politics/singapore-ge2020-election-results-as-they-come-live).

[Wikipedia's article](https://en.wikipedia.org/wiki/2020_Singaporean_general_election) on the 2020 GE for background knowledge.

[This Chartable article](https://blog.datawrapper.de/gendercolor/) on choosing colours for gender data because I didn't want to use the stereotypical pink and blue. For my gender charts, I copied the purple and green combination from [The Telegraph's visualizations on the UK's gender gap](https://www.telegraph.co.uk/women/business/women-mean-business-interactive/).
`
)});
  return main;
}
