import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClientesService } from '../vendas/clientes.service';
import { ProdutosService } from '../vendas/produtos.service';
import { VendasService } from '../vendas/vendas.service';
import { FormGroup } from '../../../node_modules/@angular/forms';
import { MessageService } from '../../../node_modules/primeng/components/common/messageservice';

@Component({
  selector: 'app-venda-cadastro',
  templateUrl: './venda-cadastro.component.html',
  styleUrls: ['./venda-cadastro.component.css'],
  providers: [ClientesService, ProdutosService, VendasService]
})
export class VendaCadastroComponent implements OnInit {

  venda: any;
  item: any;
  clientes: Array<any>;
  produtos: Array<any>;
  @Output() vendaSalva = new EventEmitter();

  constructor(private clientesService: ClientesService,
              private produtosService: ProdutosService,
              private vendaService: VendasService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.listarClientes();
    this.listarProdutos();
    this.novaVenda();
  }

  novaVenda() {
    this.venda = { itens: [], frete: 0.0, total: 0.0 };
    this.item = {};
  }

  listarClientes() {
    this.clientesService.listar().subscribe(response => this.clientes = response);
  }

  listarProdutos() {
    this.produtosService.listar().subscribe(response => this.produtos = response);
  }

  incluirItem() {
    this.item.total = this.item.produto.valor * this.item.quantidade;
    this.venda.itens.push(this.item);
    this.item = {};
    this.calcularTotal();
  }

  calcularTotal() {
    const totalItens = this.venda.itens
        .map(i => (i.produto.valor * i.quantidade))
        .reduce((total, v) => total + v, 0 );
    this.venda.total = totalItens + this.venda.frete;
  }

  adicionar(frm: FormGroup) {
      this.vendaService.adicionar(this.venda).subscribe(response => {
      this.novaVenda();
      this.messageService.add({ severity: 'success', detail: 'Venda adicionada com sucesso!' });
      frm.reset();
      this.vendaSalva.emit(response);
    });
  }

}
