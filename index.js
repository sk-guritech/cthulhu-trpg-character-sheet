document.oncontextmenu = function () {return false;}
const app = Vue.createApp({
	data() {
		return {
			identities:[
				{name:"名前"   ,value:""},
				{name:"PC",value:""},
				{name:"職業"   ,value:""},
				{name:"年齢"   ,value:""},
				{name:"性別"   ,value:""},
				{name:"住所"   ,value:""},
				{name:"出身"   ,value:""}
			],
			abilities:[
				{name:"STR"   ,value:0},
				{name:"DEX"   ,value:0},
				{name:"INT"   ,value:0},
				{name:"CON"   ,value:0},
				{name:"APP"   ,value:0},
				{name:"POW"   ,value:0},
				{name:"SIZ"   ,value:0},
				{name:"EDU"   ,value:0},
				{name:"MOV"   ,value:0}
			],
			skills:[]
		}
	},
	methods:{
		save_sheet(){
			var blob = new Blob([JSON.stringify(this.skills)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "sheet.json");
		},
		load_sheet(event){
			var _this = this;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.readAsText(file);

			reader.onload = () => {
				var json = JSON.parse(reader.result);
				this.skills = json;
			};
		},
		delete_card(event_values){
			let card_type = event_values[2];
			let cards;

			switch(card_type){
				case 'identity':
					cards = this.identities;
					break;
				case 'ability':
					cards = this.abilities;
					break;
				case 'skill':
					cards = this.skills;
					break;
			}

			cards.forEach((card, index) => {
				if(card.name == event_values[1])cards.splice(index,1);
			});
		},
		change_card_status(event_values){
			let card_type = event_values["card_type"];
			let card_name = event_values["card_name"];
			let value = event_values["value"];
			let cards;

			let index;
			let change_method;

			switch(card_type){
				case 'identity':
					cards = this.identities;
					change_method = function(cards, index, value){
						cards[index]["value"] = value;
					};
					break;
				case 'ability':
					cards = this.abilities;
					change_method = function(cards, index, value){
						cards[index]["value"] = parseInt(value);
					};
					break;
				case 'skill':
					cards = this.skills;
					change_method = function(cards, index, value){
						if(value[0] == 'f' || value[0] == 't'){
							cards[index]["is_checked"] = value == "true" ? true : false;
						}else{
							value = parseInt(value);
							if(value > 99){
								value = 99;
							}else if(value < 0){
								value = 0;
							}
							cards[index]["value"] = value;
						}

					};
					break;
			}

			cards.forEach((card, index_) =>{
				if(card.name == card_name){
					index = index_;
				}
			});

			change_method(cards, index, value);
		},
		add_new_card(event){
			let new_card_type = event.target.id.split("-")[2];
			let new_card_name;
			let new_card_value;
			let value_check_method;
			let card_push_method;
			let cards;

			switch(new_card_type){
				case 'identity':
					cards = this.identities;
					value_check_method = function(name ,value){
						if(name == null || value == null)return false;
						return !!name;
					};
					card_push_method = function(cards, name, value){
						cards.push({name: new_card_name, value: new_card_value});
					};
					break;
				case 'ability':
					cards = this.abilities;
					value_check_method = function(name, value){
						if(name == null || value == null)return false;
						if(!name)return false;
						value = parseInt(value);
						if(!value && value != 0)return false;
						return true;
					};
					card_push_method = function(cards, name, value){
						cards.push({name: new_card_name, value: parseInt(new_card_value)});
					};
					break;
				case 'skill':
					cards = this.skills;
					value_check_method = function(name, value){
						if(name == null || value == null)return false;
						if(!name)return false;
						if(!value && value != 0)return false;
						return true;
					};
					card_push_method = function(cards, name, value){
						cards.push({name: new_card_name, value: parseInt(new_card_value), is_checked: false});
					};
					break;
			}

			new_card_name  = document.getElementsByClassName("new-" + new_card_type + "-name")[0].value;
			new_card_value = document.getElementsByClassName("new-" + new_card_type + "-value")[0].value;
			document.getElementsByClassName("new-" + new_card_type + "-name")[0].value = null;
			document.getElementsByClassName("new-" + new_card_type + "-value")[0].value = null;
			if(!value_check_method(new_card_name, new_card_value))return;

			cards.forEach((card, index) => {
				if(card.name == new_card_name)cards.splice(index, 1);
			});

			card_push_method(cards, new_card_name, new_card_value);
		}
	}
});

app.component("skill_card",{
	props: ['name','value'],
	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: Number,
			required: true
		},
		is_checked: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div style="display: flex;align-items: center; padding: 0.5em; padding-top:0.1em; padding-bottom: 0.1em; border-bottom: 1px black solid ; width: 12em;">
			<input v-if="is_checked==true" type="checkbox" checked value=false @change="onChangeInput">
			<input v-else type="checkbox" value=true @change="onChangeInput">

			<div style="margin-left: 0.4em; width: 8em; font-size:small" @click.right.ctrl="deleteSkill">
				{{name}}:
			</div>
			<div style="margin-left: 0.4em">
				<input :value="value" type="number" @change="onChangeInput" style="width: 3em" min="0" max="99" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57">
			</div>
			<div style="font-size: x-small; margin-left: 0.6em; margin-top: 0.2em; width:2.5em;">
					<div style="text-decoration: underline; text-underline-position: under;">{{Math.floor(value/2)}}%</div>		
					<div>{{Math.floor(value/5)}}%</div>
			</div>
		</div>
	`,

	methods: {
		onChangeInput(event){
			this.$emit('change-skill-status', {card_type: "skill", card_name: this.name, value: event.target.value});
		},
		deleteSkill(event){
			this.$emit('delete-skill', [event, this.name, "skill"]);
		}
	}
});

app.component("ability_card",{
	props: ['name', 'value'],
	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: Number,
			required: true
		}
	},
	template: `
		<div style="display: flex;align-items: center; padding: 0.5em; padding-top:0.1em; padding-bottom: 0.1em; border-bottom: 1px black solid ; width: 12em;">
			<div style="margin-left: 0.4em; width: 8em; font-size:small" @click.right.ctrl="deleteAbility">
				{{name}}:
			</div>
			<div style="margin-left: 0.4em">
				<input :value="value" type="number" @change="onChangeInput" style="width: 4em" min="0" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57">
			</div>
			<div style="font-size: x-small; margin-left: 0.6em; margin-top: 0.2em; width:2.5em;">
					<div style="text-decoration: underline; text-underline-position: under;">{{Math.floor(value/2)}}%</div>		
					<div>{{Math.floor(value/5)}}%</div>
			</div>
		</div>			
	`,

	methods: {
		onChangeInput(event){
			this.$emit('change-ability-status', {card_type: "ability", card_name: this.name, value: event.target.value});
		},
		deleteAbility(event){
			this.$emit('delete-ability', [event, this.name, "ability"]);
		}
	}
})

app.component("identity_card",{
	props: ['name', 'value'],
	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: String,
			required: true
		}
	},
	template: `
		<div style="display: flex;align-items: center; padding: 0.5em; padding-top:0.1em; padding-bottom: 0.1em; border-bottom: 1px black solid ; width: 8em;">
			<div style="margin-left: 0.4em; width: 4.5em; font-size:small" @click.right.ctrl="deleteCard">
				{{name}}:
			</div>
			<div style="margin-left: 0.4em">
				<input :value="value" type="text" @change="updateCardStatus" style="width: 4em">
			</div>
		</div>			
	`,

	methods: {
		updateCardStatus(event){
			this.$emit('update-card-status', {card_type: "identity", card_name: this.name, value: event.target.value});
		},
		deleteCard(event){
			this.$emit('delete-card', [event, this.name, "identity"]);
		}
	}
})

app.mount("#app");