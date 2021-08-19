document.oncontextmenu = function () {return false;}
const app = Vue.createApp({
	data() {
		return {
			identities:[],
			statuses:[],
			abilities:[],
			skills:[],
			combats:[],
			weapons:[],
			show_add_cards: true
		}
	},
	methods:{
		save_sheet(){
			let json_data = {};
			json_data["identities"] = this.identities;
			json_data["statuses"] = this.statuses;
			json_data["abilities"] = this.abilities;
			json_data["skills"] = this.skills;
			json_data["combats"] = this.combats;
			json_data["weapons"] = this.weapons;

			var blob = new Blob(
				[JSON.stringify(json_data)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "sheet.json");
		},
		load_sheet(event){
			var _this = this;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.readAsText(file);

			reader.onload = () => {
				var json = JSON.parse(reader.result);
				this.identities = json["identities"];
				this.statuses = json["statuses"];
				this.abilities = json["abilities"];
				this.skills = json["skills"];
				this.combats = json["combats"];
				this.weapons = json["weapons"];
			};
		},
		delete_card(event_values){
			let card_type = event_values[2];
			let cards;

			switch(card_type){
				case 'identity':
					cards = this.identities;
					break;
				case 'status':
					cards = this.statuses;
					break;
				case 'ability':
					cards = this.abilities;
					break;
				case 'skill':
					cards = this.skills;
					break;
				case 'combat':
					cards = this.combats;
					break;
				case 'weapon':
					cards = this.weapons;
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

				case 'status':
					cards = this.statuses;
					change_method = function(cards, index, value){
						cards[index]["value"] = parseInt(value);
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
				case 'weapon':
					cards = this.weapons;
					change_method = function(cards, index, value){
						if(value[0] != "damage" && value[0] != "status"){
							cards[index][value[0]] = parseInt(value[1]);
						}else{
							cards[index][value[0]] = value[1];
						}
					}
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
						cards.push({name: name, value: value});
					};
					break;

				case 'status':
					cards = this.statuses;
					value_check_method = function(name, value){
						if(name == null || value == null)return false;
						if(!name)return false;
						value = parseInt(value);
						if(!value && value != 0)return false;
						return true;
					};
					card_push_method = function(cards, name, value){
						cards.push({name: name, value: parseInt(value)});
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
						cards.push({name: name, value: parseInt(value)});
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
						cards.push({name: name, value: parseInt(value), is_checked: false});
					};
					break;
				case 'weapon':
					cards = this.weapons;
					value_check_method = function(name, value){
						if(name == null || !name)return false;
						return true;
					};
					card_push_method = function(cards, name, values){
						cards.push({name: name, regular: parseInt(values[0]), hard: parseInt(values[1]), extream: parseInt(values[2]),
									damage: values[3], range: parseInt(values[4]), attack_times: parseInt(values[5]), bullets: parseInt(values[6]),
									failure: parseInt(values[7]), status:values[8]});
					};
					break;
			}

			if(new_card_type != "weapon"){
				new_card_name  = document.getElementsByClassName("new-" + new_card_type + "-name")[0].value;
				new_card_value = document.getElementsByClassName("new-" + new_card_type + "-value")[0].value;
				document.getElementsByClassName("new-" + new_card_type + "-name")[0].value = null;
				if(new_card_type == "identity"){
					document.getElementsByClassName("new-" + new_card_type + "-value")[0].value = null;
				}else{
					document.getElementsByClassName("new-" + new_card_type + "-value")[0].value = 0;
				}
			}else{
				new_card_name = document.getElementsByClassName("new-" + new_card_type + "-name")[0].value;
				new_card_value = [];
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-regular")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-hard")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-extream")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-damage")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-range")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-attack_times")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-bullets")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-failure")[0].value);
				new_card_value.push(document.getElementsByClassName("new-" + new_card_type + "-status")[0].value);
			}

			if(!value_check_method(new_card_name, new_card_value))return;

			cards.forEach((card, index) => {
				if(card.name == new_card_name)cards.splice(index, 1);
			});

			card_push_method(cards, new_card_name, new_card_value);
		}
	}
});

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

app.component("status_card",{
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
		<div style="display: flex;align-items: center; padding: 0.5em; padding-top:0.1em; padding-bottom: 0.1em; border-bottom: 1px black solid ; width: 8em;">
			<div style="margin-left: 0.4em; width: 4.5em; font-size:small" @click.right.ctrl="deleteCard">
				{{name}}:
			</div>
			<div style="margin-left: 0.4em">
				<input :value="value" type="number" @change="updateCardStatus" style="width: 4em">
			</div>
		</div>			
	`,

	methods: {
		updateCardStatus(event){
			this.$emit('change-status-status', {card_type: "status", card_name: this.name, value: event.target.value});
		},
		deleteCard(event){
			this.$emit('delete-card', [event, this.name, "status"]);
		}
	}
})

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

app.component("combat_card",{
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
			this.$emit('update-card-status', {card_type: "combat", card_name: this.name, value: event.target.value});
		},
		deleteCard(event){
			this.$emit('delete-card', [event, this.name, "combat"]);
		}
	}
})

app.component("weapon_card",{
	props: ['name', 'regular', 'hard', 'extream', 'damage', 'range', 'attack_times', 'bullets', 'failure', 'status'],
	props: {
		name: {
			type: String,
			required: true
		},
		regular: {
			type: Number,
			required: false
		},
		hard: {
			type: Number,
			required: false
		},
		extream: {
			type: Number,
			required: false
		},
		damage: {
			type: String,
			required: false
		},
		range: {
			type: Number,
			required: false
		},
		attack_times: {
			type: Number,
			required: false
		},
		bullets: {
			type: Number,
			required: false
		},
		failure: {
			type: Number,
			required: false
		},
		status: {
			type: String,
			required: false
		}
	},
	template: `
		<div style="display: flex;align-items: center; padding: 0.5em; padding-top:0.1em; padding-bottom: 0.1em; border-bottom: 1px black solid ; width: 35.5em;">
			<div style="margin-left: 1.5em; width: 4.5em; min-width: 4.5em; font-size:medium" @click.right.ctrl="deleteCard">
				{{name}}:
			</div>
			<div style="margin-left: 0.4em; display: flex">
				<input :value="regular" id="weapon-regular" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="hard" id="weapon-hard" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="extream" id="weapon-extream" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="damage" id="weapon-damage" type="text" style="margin-left: 0.3em;width: 5em" @change="updateCardStatus">
				<input :value="range" id="weapon-range" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="attack_times" id="weapon-attack_times" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="bullets" id="weapon-bullets" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="failure" id="weapon-failure" type="number" style="margin-left: 0.3em;width: 2.5em" @change="updateCardStatus">
				<input :value="status" id="weapon-status" type="text" style="margin-left: 0.3em;width: 3em" @change="updateCardStatus">
			</div>
		</div>			
	`,

	methods: {
		updateCardStatus(event){
			this.$emit('update-card-status', {card_type: "weapon", card_name: this.name, value: [event.target.id.split("-")[1], event.target.value]});
		},
		deleteCard(event){
			this.$emit('delete-card', [event, this.name, "weapon"]);
		}
	}
})

app.mount("#app");