<template>
    <Frame minWidth="50vw" maxWidth="50vw" maxHeight="50vh">
        <template v-slot:toolbar>
            <Toolbar @close-page="relayClosePage" pageName="Bank">{{ getBankName }}</Toolbar>
        </template>
        <template v-slot:content>
            <div class="wrapper stack">
                <div class="fill-full-width text-lg-h4 mb-4">Herzlich Willkommen {{ charName }},<br />Wie kann ich Ihnen behilflich sein?</div>
                <Module name="Konto hinzufügen" class="mb-4">
                    <Module class="mb-4" name="Allgemeines">
                        <span class="grey--text text-lg-h4 darken-1">Nr. 1 Grundlagen der Geschäftsbeziehung</span><br />
                        <span :class="color + '--text text-md-h6'">(1) Geschäftsbeziehung als Vertrauensverhältnis</span><br />
                        Die Geschäftsbeziehung zwischen dem Kunden und der {{ name }} ist durch die Besonderheiten des Bankgeschäfts und ein besonderes Vertrauensverhältnis
                        geprägt. Der Kunde kann sich darauf verlassen, dass die {{ name }} seine Aufträge mit der Sorgfalt eines ordentlichen Kaufmanns ausführt und das
                        Bankgeheimnis wahrt.<br /><br />
                        <span :class="color + '--text text-md-h6'">(2) Allgemeine und besondere Geschäftsbedingungen</span><br />
                        Für die Geschäftsbeziehung gelten ergänzend zu den einzelvertraglichen Vereinbarungen diese Allgemeinen Geschäftsbedingungen (AGB). Für einzelne
                        Geschäftszweige gelten ergänzend oder abweichend besondere Bedingungen, z. B. für die Bereiche des Zahlungsverkehrs, des Sparverkehrs und der
                        Wertpapiergeschäfte; diese werden beim Vertragsabschluss (etwa bei der Kontoeröffnung) oder bei der Erteilung von Aufträgen mit dem Kunden vereinbart.<br /><br />
                        <span class="grey--text text-lg-h4 darken-1">Nr. 2 Änderungen</span><br />
                        <span :class="color + '--text text-md-h6'">(1) Änderungsangebot</span><br />
                        Änderungen dieser Allgemeinen Geschäftsbedingungen und der besonderen Bedingungen werden dem Kunden spätestens zwei Monate vor dem vorgeschlagenen Zeitpunkt
                        ihres Wirksamwerdens in Textform angeboten. Hat der Kunde mit der {{ name }} im Rahmen der Geschäftsbeziehung einen elektronischen Kommunikationsweg
                        vereinbart (z. B. das Elektronische Postfach), können die Änderungen auch auf diesem Wege angeboten werden.<br /><br />
                        <span :class="color + '--text text-md-h6'">(2) Annahme durch den Kunden</span><br />
                        Die von der {{ name }} angebotenen Änderungen werden nur wirksam, wenn der Kunde diese annimmt, gegebenenfalls im Wege der nachfolgend geregelten
                        Zustimmungsfiktion.<br /><br />
                        <span :class="color + '--text text-md-h6'">(3) Annahme durch den Kunden im Wege der Zustimmungsfiktion</span><br />
                        Das Schweigen des Kunden gilt nur dann als Annahme des Änderungsangebotes (Zustimmungsfiktion), wenn<br />
                        a) das Änderungsangebot der {{ name }} erfolgt, um die Übereinstimmung der vertraglichen Bestimmungen mit einer veränderten Rechtslage wiederherzustellen,
                        weil eine Bestimmung der Allgemeinen Geschäftsbedingungen oder der besonderen Bedingungen <br />– aufgrund einer Änderung von Gesetzen, einschließlich
                        unmittelbar geltender Rechtsvorschriften der Europäischen Union, nicht mehr der Rechtslage entspricht oder <br />– durch eine rechtskräftige gerichtliche
                        Entscheidung, auch durch ein Gericht erster Instanz, unwirksam wird oder nicht mehr verwendet werden darf oder<br />
                        – aufgrund einer verbindlichen Verfügung einer für die {{ name }} zuständigen nationalen oder internationalen Behörde (z. B. der Bundesanstalt für
                        Finanzdienstleistungsaufsicht oder der Europäischen Zentralbank) nicht mehr mit den aufsichtsrechtlichen Verpflichtungen der {{ name }} in Einklang zu
                        bringen ist und<br />
                        b) der Kunde das Änderungsangebot der {{ name }} nicht vor dem vorgeschlagenen Zeitpunkt des Wirksamwerdens der Änderungen abgelehnt hat. Die
                        {{ name }} wird den Kunden im Änderungsangebot auf die Folgen seines Schweigens hinweisen.<br /><br />
                        <span :class="color + '--text text-md-h6'">(4) Ausschluss der Zustimmungsfiktion</span><br />
                        Die Zustimmungsfiktion findet keine Anwendung<br />
                        – bei Änderungen der Nummern 2 und 17 Abs. 6 der Allgemeinen Geschäftsbedingungen und der entsprechenden Regelungen in den besonderen Bedingungen oder<br />
                        – bei Änderungen, die die Hauptleistungspflichten des Vertrages und die Entgelte für Hauptleistungen betreffen, oder<br />
                        – bei Änderungen von Entgelten, die auf eine über das vereinbarte Entgelt für die Hauptleistung hinausgehende Zahlung des Verbrauchers gerichtet sind,
                        oder<br />
                        – bei Änderungen, die dem Abschluss eines neuen Vertrages gleichkommen, oder<br />
                        – bei Änderungen, die das bisher vereinbarte Verhältnis von Leistung und<br />
                        Gegenleistung erheblich zugunsten der {{ name }} verschieben würden. In diesen Fällen wird die {{ name }} die Zustimmung des Kunden zu den Änderungen auf
                        andere Weise einholen.<br /><br />
                        <span :class="color + '--text text-md-h6'">(5) Kündigungsrecht des Kunden bei der Zustimmungsfiktion</span><br />
                        Macht die {{ name }} von der Zustimmungsfiktion Gebrauch, kann der Kunde den von der Änderung betroffenen Vertrag vor dem vorgeschlagenen Zeitpunkt des
                        Wirksamwerdens der Änderungen auch fristlos und kostenfrei kündigen. Auf dieses Kündigungsrecht wird die {{ name }} den Kunden in ihrem Änderungsangebot
                        besonders hinweisen.<br />
                    </Module>
                    <div class="split space-between mb-4">
                        <Input
                            label="Vorname"
                            class="fill-full-width mr-5"
                            :placeholder="charName.split('_')[0]"
                            :number-only="false"
                            :stack="false"
                            :rules="[]"
                            :readonly="true"
                        ></Input>
                        <Input
                            label="Nachname"
                            class="fill-full-width mr-5"
                            :placeholder="charName.split('_')[1]"
                            :number-only="false"
                            :stack="false"
                            :rules="[]"
                            :readonly="true"
                        ></Input>
                        <RangeInput
                            class="fill-full-width"
                            :minIndex="0"
                            :maxIndex="2"
                            :indexValue="option"
                            :increment="1"
                            :values="options"
                            @input="(e) => changeOption(e)"
                        ></RangeInput>
                    </div>
                    <div class="split center">
                        <Button class="split-center" :color="color" :glow="true" :raise="true" @click="createBank">Vertrag unterschreiben</Button>
                    </div>
                </Module>
                <Module name="Konto auflösen" v-if="banks.length > 0">
                    <div class="split split-center mb-4" v-for="(bank, index) in banks" :key="index">
                        <Input class="fill-full-width mr-2" label="Kontoart" :placeholder="getBankType(bank.type)" :stack="true" :readonly="true"></Input>
                        <Input class="fill-full-width mr-2" label="Kontoinhaber" :placeholder="bank.owner" :stack="true" :readonly="true"></Input>
                        <Input class="fill-full-width mr-2" label="Kontostand" :placeholder="getBankCash(bank.amount)" :stack="true" :readonly="true"></Input>
                        <Button :glow="true" :raise="true" @click="deleteBank(bank.type, bank.iban)">
                            <Icon icon="icon-bin" class="red--text" :size="33"></Icon>
                        </Button>
                    </div>
                </Module>
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import RangeInput from '../../../../../src-webviews/src/components/RangeInput.vue';

export const ComponentName = 'Bank';
export default defineComponent({
    name: ComponentName,
    components: {
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Input: defineAsyncComponent(() => import('@components/Input.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        RangeInput,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            name: '',
            type: '',
            bank: '',
            banks: [],
            charName: '',
            color: 'grey',
            items: ['private', 'concern', 'credit'],
            option: 0,
            options: ['Privatkonto', 'Firmenkonto', 'Kreditkonto'],
        };
    },
    methods: {
        setData(name, color, charName, banks) {
            this.name = name;
            this.charName = charName;
            this.color = color;
            this.banks = banks;
        },
        getBankType(type: string) {
            let typ = '';
            switch (type) {
                case 'private':
                    typ = 'Privatkonto';
                    break;
                case 'concern':
                    typ = 'Firmenkonto';
                    break;
                default:
                    typ = 'Kreditkonto';
                    break;
            }
            return typ.toUpperCase();
        },
        getBankCash(amount: number) {
            var parts = amount.toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        },
        handlePress(e: KeyboardEvent) {
            if (e.key.toLowerCase() !== 'escape') return;
            if (!('alt' in window)) return;
            alt.emit(`${ComponentName}:Close`);
        },
        relayClosePage() {
            this.$emit('close-page', `${ComponentName}:Close`);
        },
        changeOption(e: Event) {
            this.option = parseInt(e.target['value']);
        },
        changeFirstname(e: Event) {
            let firstname = e.target['value'];
            let lastname = this.charName.split('_')[1];
            this.charName = `${firstname}_${lastname}`;
        },
        changeLastname(e: Event) {
            let firstname = this.charName.split('_')[0];
            let lastname = e.target['value'];
            this.charName = `${firstname}_${lastname}`;
        },
        createBank() {
            if ('alt' in window) {
                alt.emit(`${ComponentName}:Create`, this.items[this.option]);
            } else console.log(`alt.emit('${ComponentName}:Create', '${this.items[this.option]}', '${this.items[this.option]}');`);
        },
        deleteBank(iban: string) {
            if ('alt' in window) {
                alt.emit(`${ComponentName}:Remove`, iban);
            } else console.log(`alt.emit('${ComponentName}:Remove', '${iban}');`);
        },
    },
    computed: {
        getColor() {
            return this.color;
        },
        getBankName() {
            return this.name;
        },
        getOption() {
            return this.options[this.option];
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);
        if ('alt' in window) {
            alt.on(`${ComponentName}:Update`, this.setData);
            alt.emit(`${ComponentName}:Ready`);
            alt.emit('ready');
        } else
            this.setData('Fleeca Bank', 'green', 'Sony_Vegas', [
                { _id: 1, name: 'Fleeca Bank', owner: 'Sony Vegas', amount: 2000000000.25, type: 'private' },
                {
                    _id: 2,
                    name: 'Fleeca Bank',
                    owner: 'Los Santos Police Department',
                    amount: 200000.25,
                    type: 'concern',
                },
                { _id: 3, name: 'Fleeca Bank', owner: 'Sony Vegas', amount: 20000000.25, type: 'credit' },
            ]);
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
        if ('alt' in window) {
            alt.off(`${ComponentName}:Update`, this.updateBalances);
        }
    },
});
</script>

<style scoped>
.outlined {
    box-shadow: 0 0 10px grey inset;
}
</style>
